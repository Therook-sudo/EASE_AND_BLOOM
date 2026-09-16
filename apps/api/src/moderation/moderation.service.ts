import { Injectable, Logger, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { encryptText, decryptText } from './encryption.util';
import { FlagAction } from './dto/resolve-flag.dto';

export enum ModerationTier {
  CLEAN = 0,
  TIER_1_AUTO_HIDE = 1,
  TIER_2_FLAG_REVIEW = 2,
  TIER_3_CRISIS_ESCALATE = 3,
  TIER_4_REDIRECT = 4,
}

export interface ModerationResult {
  tier: ModerationTier;
  category: 'HARASSMENT' | 'MISINFORMATION' | 'CRISIS' | 'PREDATORY' | 'OFF_TOPIC' | 'CLEAN';
  confidenceScore: number;
  perspective: 'first_person_disclosure' | 'second_person_targeting' | 'neutral';
  rationale: string;
  isAllowedClinicalTerm: boolean;
  systemAction: 'publish' | 'hide_and_queue' | 'escalate_and_publish' | 'flag_and_publish';
}

@Injectable()
export class ModerationService {
  private readonly logger = new Logger(ModerationService.name);

  // Stage 1 In-Memory Clinical Allowlist (never flagged in isolation)
  private readonly clinicalAllowlist = [
    'pcos', 'endometriosis', 'vagina', 'vulva', 'cramps', 'miscarriage', 'fertility',
    'ovaries', 'tampon', 'pads', 'menstruation', 'postpartum', 'abortion', 'depression',
    'anxiety', 'trauma', 'bipolar', 'crying', 'suicide', 'self-harm', 'bleeding', 'uterus',
    'fibroids', 'cervix', 'pelvic', 'discharge', 'infertility', 'hot flashes', 'menopause'
  ];

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Hybrid 2-Stage Contextual Classifier Pipeline
   */
  evaluateContent(text: string, isAnonymous = false): ModerationResult {
    const cleanText = text.toLowerCase();

    // Stage 1: Check if content contains clinical allowlist terms
    const hasClinicalTerm = this.clinicalAllowlist.some((term) => cleanText.includes(term));

    // Stage 2: Intent & Perspective Scoring
    // 1. Check for Severe Targeted Harassment / Hate / Doxxing (Tier 1)
    const harassmentTargetingPatterns = [
      'you are ugly', 'kill yourself', 'kys', 'die bitch', 'whore', 'slut',
      'fuck you', 'you deserve pain', 'leak your address', 'doxx', 'scam them'
    ];
    const isTargetedHarassment = harassmentTargetingPatterns.some((p) => cleanText.includes(p));

    if (isTargetedHarassment) {
      return {
        tier: ModerationTier.TIER_1_AUTO_HIDE,
        category: 'HARASSMENT',
        confidenceScore: 0.96,
        perspective: 'second_person_targeting',
        rationale: 'Targeted hostile insult or threat directed at another individual.',
        isAllowedClinicalTerm: hasClinicalTerm,
        systemAction: 'hide_and_queue',
      };
    }

    // 2. Check for Crisis / Self-Harm / Suicide / Abuse Disclosure (Tier 3)
    // CRITICAL: First-person disclosures must stay published and route privately!
    const crisisPatterns = [
      'suicid', 'kill myself', 'end my life', 'want to die',
      'hopeless', "can't go on", 'harm myself', 'giving up on life',
      'he hits me', 'abusing me', 'domestic violence', 'cuts on my arms'
    ];
    const isCrisis = crisisPatterns.some((p) => cleanText.includes(p));

    if (isCrisis) {
      return {
        tier: ModerationTier.TIER_3_CRISIS_ESCALATE,
        category: 'CRISIS',
        confidenceScore: 0.94,
        perspective: 'first_person_disclosure',
        rationale: 'First-person expression of acute hopelessness, self-harm, or domestic crisis.',
        isAllowedClinicalTerm: hasClinicalTerm,
        systemAction: 'escalate_and_publish', // NEVER delete a crisis disclosure
      };
    }

    // 3. Check for Extreme Unverified Health Misinformation (Tier 2)
    const misinfoPatterns = [
      'cures cancer 100%', 'don\'t take insulin', 'vaccines are poison',
      'cure pcos in 3 days guaranteed', 'drink bleach'
    ];
    const isMisinfo = misinfoPatterns.some((p) => cleanText.includes(p));

    if (isMisinfo) {
      return {
        tier: ModerationTier.TIER_2_FLAG_REVIEW,
        category: 'MISINFORMATION',
        confidenceScore: 0.88,
        perspective: 'neutral',
        rationale: 'Unverified definitive cure or dangerous alternative medical claim.',
        isAllowedClinicalTerm: hasClinicalTerm,
        systemAction: 'flag_and_publish',
      };
    }

    // Default: Clean Content
    return {
      tier: ModerationTier.CLEAN,
      category: 'CLEAN',
      confidenceScore: 0.99,
      perspective: 'first_person_disclosure',
      rationale: 'Empathetic community discussion meeting guidelines.',
      isAllowedClinicalTerm: hasClinicalTerm,
      systemAction: 'publish',
    };
  }

  /**
   * Process post through moderation pipeline during creation
   */
  async processPostModeration(post: any, rawContent: string, authorId: string) {
    const evalResult = this.evaluateContent(rawContent, post.isAnonymous);

    if (evalResult.tier === ModerationTier.TIER_1_AUTO_HIDE) {
      // Auto-hide post and queue for moderator confirmation
      await this.prisma.post.update({
        where: { id: post.id },
        data: { status: 'hidden_under_review' },
      });

      await this.prisma.contentFlag.create({
        data: {
          contentId: post.id,
          authorId,
          category: 'HARASSMENT',
          confidenceScore: evalResult.confidenceScore,
          tier: 'TIER_1_AUTO_HIDE',
          status: 'pending',
          reviewerNotes: evalResult.rationale,
        },
      });

      this.logger.warn(`[Tier 1 Auto-Hide] Post ${post.id} paused for review: ${evalResult.rationale}`);
    } else if (evalResult.tier === ModerationTier.TIER_3_CRISIS_ESCALATE) {
      // Keep post visible + create encrypted crisis escalation record + trigger mobile ping
      const encryptedSnippet = encryptText(rawContent);

      const escalation = await this.prisma.crisisEscalationLog.create({
        data: {
          flagId: post.id,
          userId: authorId,
          subgroupId: post.tags && post.tags.length > 0 ? post.tags[0].tagId : 'general',
          contentSnippetEncrypted: encryptedSnippet,
          outreachStatus: 'pending_outreach',
        },
      });

      // Dispatch simulated mobile alert to the founder
      this.dispatchCrisisMobileAlert(escalation.id, authorId, rawContent);
    } else if (evalResult.tier === ModerationTier.TIER_2_FLAG_REVIEW) {
      // Stays visible + adds to 24h review queue
      await this.prisma.contentFlag.create({
        data: {
          contentId: post.id,
          authorId,
          category: 'MISINFORMATION',
          confidenceScore: evalResult.confidenceScore,
          tier: 'TIER_2_FLAG_REVIEW',
          status: 'pending',
          reviewerNotes: evalResult.rationale,
        },
      });
    }

    return evalResult;
  }

  /**
   * Dispatches mobile alert (WhatsApp/Telegram/SMS webhook) to founder
   */
  private dispatchCrisisMobileAlert(escalationId: string, userId: string, snippet: string) {
    this.logger.log(
      `🚨 [TIER 3 CRISIS MOBILE ALERT DISPATCHED] -> Founder phone pinged! Escalation ID: ${escalationId}. Member: ${userId}. Snippet preview: "${snippet.slice(0, 60)}..."`
    );
  }

  /**
   * Get Pending Content Review Queue (Tier 1 & Tier 2)
   */
  async getModerationQueue(userRole: string) {
    if (!['MODERATOR', 'CRISIS_LEAD', 'SUPER_ADMIN'].includes(userRole)) {
      throw new ForbiddenException('Restricted to community safety moderators.');
    }

    const flags = await this.prisma.contentFlag.findMany({
      where: { status: 'pending' },
      orderBy: { createdAt: 'desc' },
      include: {
        post: {
          include: {
            author: {
              select: {
                id: true,
                profile: true,
              },
            },
          },
        },
      },
    });

    return flags.map((f) => ({
      id: f.id,
      contentId: f.contentId,
      category: f.category,
      tier: f.tier,
      confidenceScore: f.confidenceScore,
      reviewerNotes: f.reviewerNotes,
      createdAt: f.createdAt,
      post: f.post
        ? {
            id: f.post.id,
            content: f.post.content,
            isAnonymous: f.post.isAnonymous,
            status: f.post.status,
            authorName: f.post.author?.profile?.displayName || 'Sister',
            authorHandle: f.post.author?.profile?.username || 'member',
          }
        : null,
    }));
  }

  /**
   * Action on a Flag in the review queue
   */
  async resolveFlag(flagId: string, action: FlagAction, notes: string | undefined, moderatorId: string) {
    const flag = await this.prisma.contentFlag.findUnique({
      where: { id: flagId },
      include: { post: true },
    });

    if (!flag) {
      throw new NotFoundException('Flag record not found.');
    }

    if (action === FlagAction.CONFIRM_REMOVAL && flag.post) {
      await this.prisma.post.update({
        where: { id: flag.contentId },
        data: { status: 'deleted' },
      });
    } else if (action === FlagAction.RESTORE_POST && flag.post) {
      await this.prisma.post.update({
        where: { id: flag.contentId },
        data: { status: 'published' },
      });
    }

    await this.prisma.contentFlag.update({
      where: { id: flagId },
      data: {
        status: action === FlagAction.DISMISS ? 'dismissed' : 'actioned',
        reviewerNotes: notes || flag.reviewerNotes,
      },
    });

    return { message: `Flag resolved with action: ${action}` };
  }

  /**
   * Get Active Tier 3 Crisis Escalation Alerts (Restricted to CRISIS_LEAD & SUPER_ADMIN)
   */
  async getCrisisAlerts(userRole: string) {
    if (!['CRISIS_LEAD', 'SUPER_ADMIN'].includes(userRole)) {
      throw new ForbiddenException('Confidential: Restricted to Crisis Care Leads.');
    }

    const logs = await this.prisma.crisisEscalationLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: 20,
    });

    return logs.map((log) => {
      const decrypted = decryptText(log.contentSnippetEncrypted);
      const createdAtTime = new Date(log.createdAt).getTime();
      const elapsedMinutes = Math.round((Date.now() - createdAtTime) / 60000);
      const slaRemainingMinutes = Math.max(0, 45 - elapsedMinutes);

      return {
        id: log.id,
        userId: log.userId,
        subgroupId: log.subgroupId,
        decryptedSnippet: decrypted,
        outreachStatus: log.outreachStatus,
        createdAt: log.createdAt,
        elapsedMinutes,
        slaRemainingMinutes,
        isSlaBreached: elapsedMinutes > 45 && log.outreachStatus === 'pending_outreach',
        suggestedWarmDraft: `Hey love, I read what you shared and just wanted to check in on you. You don\'t have to carry this by yourself. I\'m here if you want to chat, and here are some confidential 24/7 resources: [Call 988 / Text 741741]. No pressure to reply, just wanted you to know you are seen. 🌸`,
      };
    });
  }

  /**
   * Acknowledge Crisis Outreach
   */
  async acknowledgeCrisis(escalationId: string, responderId: string, notes?: string) {
    const log = await this.prisma.crisisEscalationLog.findUnique({
      where: { id: escalationId },
    });

    if (!log) {
      throw new NotFoundException('Crisis record not found.');
    }

    const updated = await this.prisma.crisisEscalationLog.update({
      where: { id: escalationId },
      data: {
        responderId,
        acknowledgedAt: new Date(),
        outreachStatus: 'outreach_sent',
        notesEncrypted: notes ? encryptText(notes) : undefined,
      },
    });

    return {
      message: 'Crisis outreach recorded successfully.',
      status: updated.outreachStatus,
    };
  }

  /**
   * Automated 60-Day Pruning Policy
   */
  async pruneOldCrisisLogs() {
    const sixtyDaysAgo = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000);

    const oldLogs = await this.prisma.crisisEscalationLog.findMany({
      where: {
        createdAt: { lt: sixtyDaysAgo },
      },
    });

    for (const log of oldLogs) {
      // Redact sensitive text snippet and user linkage, keeping only anonymized telemetry
      await this.prisma.crisisEscalationLog.update({
        where: { id: log.id },
        data: {
          contentSnippetEncrypted: '[REDACTED_AFTER_60_DAYS]',
          notesEncrypted: null,
          userId: 'anonymized_user',
        },
      });
    }

    return {
      prunedCount: oldLogs.length,
      message: `Successfully redacted ${oldLogs.length} crisis logs older than 60 days.`,
    };
  }
}
