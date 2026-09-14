import { Injectable, NotFoundException, ConflictException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';
import { FeedQueryDto } from './dto/feed-query.dto';

@Injectable()
export class PostsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, dto: CreatePostDto) {
    // 1. Process tags (find or create)
    const tagConnects: { tagId: string }[] = [];
    if (dto.tags && dto.tags.length > 0) {
      for (const tagName of dto.tags) {
        const cleanName = tagName.replace(/^#/, '').trim();
        const slug = cleanName.toLowerCase().replace(/[^a-z0-9]/g, '-');
        
        let tag = await this.prisma.tag.findUnique({ where: { slug } });
        if (!tag) {
          tag = await this.prisma.tag.create({
            data: {
              name: cleanName,
              slug,
              description: `Community discussions tagged with #${cleanName}`,
            },
          });
        }
        tagConnects.push({ tagId: tag.id });
      }
    }

    // 2. Create Post
    const post = await this.prisma.post.create({
      data: {
        authorId: userId,
        content: dto.content,
        isAnonymous: dto.isAnonymous ?? false,
        contentWarning: dto.contentWarning || null,
        mediaUrls: dto.mediaUrls || [],
        status: 'published',
        tags: {
          create: tagConnects.map((t) => ({ tagId: t.tagId })),
        },
        poll: dto.poll
          ? {
              create: {
                question: dto.poll.question,
                expiresAt: new Date(Date.now() + (dto.poll.durationHours || 24) * 60 * 60 * 1000),
                options: {
                  create: dto.poll.options.map((optText, index) => ({
                    optionText: optText,
                    orderIndex: index,
                  })),
                },
              },
            }
          : undefined,
      },
      include: {
        author: {
          select: {
            id: true,
            role: true,
            quizVerified: true,
            profile: true,
          },
        },
        tags: {
          include: { tag: true },
        },
        poll: {
          include: {
            options: {
              orderBy: { orderIndex: 'asc' },
            },
          },
        },
        communityNotes: {
          where: { status: 'CURRENTLY_RATED_HELPFUL' },
        },
      },
    });

    return this.formatPostForClient(post, userId);
  }

  async getFeed(query: FeedQueryDto, currentUserId?: string) {
    const limit = query.limit || 20;

    const whereClause: any = {
      status: 'published',
    };

    if (query.tag && query.tag !== 'all') {
      const cleanTag = query.tag.toLowerCase().replace(/^#/, '');
      whereClause.tags = {
        some: {
          tag: {
            slug: cleanTag,
          },
        },
      };
    }

    const posts = await this.prisma.post.findMany({
      where: whereClause,
      take: limit,
      skip: query.cursor ? 1 : 0,
      cursor: query.cursor ? { id: query.cursor } : undefined,
      orderBy: { createdAt: 'desc' },
      include: {
        author: {
          select: {
            id: true,
            role: true,
            quizVerified: true,
            profile: true,
          },
        },
        tags: {
          include: { tag: true },
        },
        poll: {
          include: {
            options: {
              orderBy: { orderIndex: 'asc' },
            },
            votes: currentUserId
              ? {
                  where: { userId: currentUserId },
                }
              : false,
          },
        },
        communityNotes: {
          where: { status: 'CURRENTLY_RATED_HELPFUL' },
        },
        reactions: currentUserId
          ? {
              where: { userId: currentUserId },
            }
          : false,
      },
    });

    const items = posts.map((p) => this.formatPostForClient(p, currentUserId));
    const nextCursor = posts.length === limit ? posts[posts.length - 1].id : null;

    return {
      items,
      nextCursor,
    };
  }

  async getPostById(postId: string, currentUserId?: string) {
    const post = await this.prisma.post.findUnique({
      where: { id: postId },
      include: {
        author: {
          select: {
            id: true,
            role: true,
            quizVerified: true,
            profile: true,
          },
        },
        tags: {
          include: { tag: true },
        },
        poll: {
          include: {
            options: {
              orderBy: { orderIndex: 'asc' },
            },
            votes: currentUserId
              ? {
                  where: { userId: currentUserId },
                }
              : false,
          },
        },
        communityNotes: {
          where: { status: 'CURRENTLY_RATED_HELPFUL' },
        },
        reactions: currentUserId
          ? {
              where: { userId: currentUserId },
            }
          : false,
      },
    });

    if (!post || post.status === 'deleted') {
      throw new NotFoundException('Post not found.');
    }

    return this.formatPostForClient(post, currentUserId);
  }

  async votePoll(postId: string, optionId: string, userId: string) {
    const poll = await this.prisma.poll.findUnique({
      where: { postId },
      include: { options: true },
    });

    if (!poll) {
      throw new NotFoundException('Poll not found on this post.');
    }

    if (new Date() > poll.expiresAt) {
      throw new ForbiddenException('This poll has ended.');
    }

    const existingVote = await this.prisma.pollVote.findUnique({
      where: {
        pollId_userId: {
          pollId: poll.id,
          userId,
        },
      },
    });

    if (existingVote) {
      throw new ConflictException('You have already voted in this poll.');
    }

    const option = poll.options.find((o) => o.id === optionId);
    if (!option) {
      throw new NotFoundException('Poll option does not exist.');
    }

    // Atomic transaction: Create vote and increment counts
    await this.prisma.$transaction([
      this.prisma.pollVote.create({
        data: {
          pollId: poll.id,
          optionId,
          userId,
        },
      }),
      this.prisma.pollOption.update({
        where: { id: optionId },
        data: { votesCount: { increment: 1 } },
      }),
      this.prisma.poll.update({
        where: { id: poll.id },
        data: { totalVotes: { increment: 1 } },
      }),
    ]);

    return this.getPostById(postId, userId);
  }

  async deletePost(postId: string, userId: string, userRole: string) {
    const post = await this.prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      throw new NotFoundException('Post not found.');
    }

    const isAuthor = post.authorId === userId;
    const isMod = ['MODERATOR', 'CRISIS_LEAD', 'SUPER_ADMIN'].includes(userRole);

    if (!isAuthor && !isMod) {
      throw new ForbiddenException('You do not have permission to delete this post.');
    }

    await this.prisma.post.update({
      where: { id: postId },
      data: { status: 'deleted' },
    });

    return { message: 'Post removed successfully.' };
  }

  async getTags() {
    return this.prisma.tag.findMany({
      where: { isActive: true },
      include: {
        _count: {
          select: { posts: true },
        },
      },
      orderBy: {
        posts: { _count: 'desc' },
      },
    });
  }

  private formatPostForClient(post: any, currentUserId?: string) {
    // Anonymization logic: If isAnonymous is true, strip author identity for all public queries!
    const isAnonymous = post.isAnonymous;
    const author = isAnonymous
      ? {
          displayName: 'Anonymous Sister',
          username: 'anonymous',
          avatarUrl: null,
          isAnonymous: true,
          quizVerified: true,
        }
      : {
          id: post.author?.id,
          displayName: post.author?.profile?.displayName || 'Sister',
          username: post.author?.profile?.username || 'member',
          avatarUrl: post.author?.profile?.avatarUrl,
          isAnonymous: false,
          quizVerified: post.author?.quizVerified ?? false,
          role: post.author?.role,
        };

    const userVotedOptionId =
      post.poll?.votes && post.poll.votes.length > 0 ? post.poll.votes[0].optionId : null;

    const userReactions = (post.reactions || []).map((r: any) => r.reactionType);

    return {
      id: post.id,
      content: post.content,
      contentWarning: post.contentWarning,
      mediaUrls: post.mediaUrls,
      isAnonymous,
      author,
      tags: (post.tags || []).map((t: any) => ({
        id: t.tag.id,
        name: t.tag.name,
        slug: t.tag.slug,
      })),
      poll: post.poll
        ? {
            id: post.poll.id,
            question: post.poll.question,
            expiresAt: post.poll.expiresAt,
            totalVotes: post.poll.totalVotes,
            hasEnded: new Date() > post.poll.expiresAt,
            userVotedOptionId,
            options: (post.poll.options || []).map((o: any) => ({
              id: o.id,
              optionText: o.optionText,
              votesCount: o.votesCount,
              percentage:
                post.poll.totalVotes > 0
                  ? Math.round((o.votesCount / post.poll.totalVotes) * 100)
                  : 0,
            })),
          }
        : null,
      communityNotes: post.communityNotes || [],
      likesCount: post.likesCount,
      hugsCount: post.hugsCount,
      commentsCount: post.commentsCount,
      bookmarksCount: post.bookmarksCount,
      hasLiked: userReactions.includes('like'),
      hasSentHug: userReactions.includes('hug_support'),
      hasBookmarked: userReactions.includes('bookmark'),
      createdAt: post.createdAt,
    };
  }
}
