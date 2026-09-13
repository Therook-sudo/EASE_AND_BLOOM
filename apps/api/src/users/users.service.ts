import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async getMyProfile(userId: string) {
    const profile = await this.prisma.profile.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            role: true,
            quizVerified: true,
            quizCompletedAt: true,
            createdAt: true,
          },
        },
      },
    });

    if (!profile) {
      throw new NotFoundException('Profile not found.');
    }
    return profile;
  }

  async updateMyProfile(userId: string, dto: UpdateProfileDto) {
    const updated = await this.prisma.profile.update({
      where: { userId },
      data: {
        ...dto,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            role: true,
            quizVerified: true,
          },
        },
      },
    });

    return updated;
  }

  async getPublicProfile(username: string) {
    const profile = await this.prisma.profile.findUnique({
      where: { username: username.toLowerCase() },
      include: {
        user: {
          select: {
            id: true,
            role: true,
            quizVerified: true,
            createdAt: true,
            _count: {
              select: {
                posts: true,
                followers: true,
                following: true,
              },
            },
          },
        },
      },
    });

    if (!profile) {
      throw new NotFoundException(`Member @${username} not found.`);
    }

    return {
      userId: profile.userId,
      username: profile.username,
      displayName: profile.displayName,
      bio: profile.bio,
      avatarUrl: profile.avatarUrl,
      reputationScore: profile.reputationScore,
      role: profile.user.role,
      quizVerified: profile.user.quizVerified,
      joinedAt: profile.user.createdAt,
      stats: profile.user._count,
    };
  }

  async checkUsernameAvailable(username: string) {
    const cleanUsername = username.toLowerCase().trim();
    const existing = await this.prisma.profile.findUnique({
      where: { username: cleanUsername },
    });
    return {
      username: cleanUsername,
      isAvailable: !existing,
    };
  }
}
