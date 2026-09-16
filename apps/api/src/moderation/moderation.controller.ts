import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ModerationService } from './moderation.service';
import { ResolveFlagDto, AckCrisisDto } from './dto/resolve-flag.dto';
import { TestScanDto } from './dto/test-scan.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('Content Safety & Crisis Care')
@Controller('moderation')
export class ModerationController {
  constructor(private readonly moderationService: ModerationService) {}

  @Post('test-scan')
  @ApiOperation({ summary: 'Test the 2-Stage Contextual Classifier on sample text' })
  testScan(@Body() dto: TestScanDto) {
    return this.moderationService.evaluateContent(dto.text, dto.isAnonymous);
  }

  @Get('queue')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get pending Tier 1 & Tier 2 review items' })
  async getModerationQueue(@CurrentUser() user: any) {
    return this.moderationService.getModerationQueue(user.role);
  }

  @Post('queue/:flagId/resolve')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Resolve a flagged post (restore, confirm removal, dismiss)' })
  async resolveFlag(
    @Param('flagId') flagId: string,
    @Body() dto: ResolveFlagDto,
    @CurrentUser() user: any,
  ) {
    return this.moderationService.resolveFlag(flagId, dto.action, dto.notes, user.id);
  }

  @Get('crisis-alerts')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get active Tier 3 Crisis Escalation alerts (Confidential)' })
  async getCrisisAlerts(@CurrentUser() user: any) {
    return this.moderationService.getCrisisAlerts(user.role);
  }

  @Post('crisis-alerts/:id/ack')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Acknowledge crisis alert and log empathetic check-in' })
  async acknowledgeCrisis(
    @Param('id') id: string,
    @Body() dto: AckCrisisDto,
    @CurrentUser() user: any,
  ) {
    return this.moderationService.acknowledgeCrisis(id, user.id, dto.notes);
  }

  @Post('prune-old-logs')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Run 60-day privacy auto-pruning' })
  async pruneOldLogs(@CurrentUser() user: any) {
    return this.moderationService.pruneOldCrisisLogs();
  }
}
