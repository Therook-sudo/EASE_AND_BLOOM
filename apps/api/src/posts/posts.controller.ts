import { Controller, Post, Get, Delete, Body, Param, Query, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { VotePollDto } from './dto/vote-poll.dto';
import { FeedQueryDto } from './dto/feed-query.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { QuizVerifiedGuard } from '../auth/guards/quiz-verified.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('Sanctuary Posts & Discussions')
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, QuizVerifiedGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a post, question, or poll (Requires verified quiz)' })
  async create(@CurrentUser() user: any, @Body() dto: CreatePostDto) {
    return this.postsService.create(user.id, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get sanctuary feed filtered by topic tags' })
  async getFeed(@Query() query: FeedQueryDto, @Req() req: any) {
    // Optional auth token extraction for personalized reaction & vote state
    const currentUserId = req.user?.id;
    return this.postsService.getFeed(query, currentUserId);
  }

  @Get('tags')
  @ApiOperation({ summary: 'Get active topic tags' })
  async getTags() {
    return this.postsService.getTags();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get post by ID' })
  async getPost(@Param('id') id: string, @Req() req: any) {
    const currentUserId = req.user?.id;
    return this.postsService.getPostById(id, currentUserId);
  }

  @Post(':id/poll/vote')
  @UseGuards(JwtAuthGuard, QuizVerifiedGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Vote on an interactive poll' })
  async votePoll(@Param('id') id: string, @CurrentUser() user: any, @Body() dto: VotePollDto) {
    return this.postsService.votePoll(id, dto.optionId, user.id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a post' })
  async deletePost(@Param('id') id: string, @CurrentUser() user: any) {
    return this.postsService.deletePost(id, user.id, user.role);
  }
}
