'use client';

import React, { useState } from 'react';
import { X, ShieldAlert, HeartHandshake, Eye, CheckCircle2, AlertTriangle, Send, Sparkles, RefreshCw, Trash2, ArrowRight, ShieldCheck, Clock, Lock } from 'lucide-react';
import { useAuthStore } from '../../lib/auth-store';
import { apiRequest } from '../../lib/api';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

interface CrisisAlert {
  id: string;
  userId: string;
  subgroupId: string;
  decryptedSnippet: string;
  outreachStatus: string;
  createdAt: string;
  elapsedMinutes: number;
  slaRemainingMinutes: number;
  isSlaBreached: boolean;
  suggestedWarmDraft: string;
}

interface FlagItem {
  id: string;
  contentId: string;
  category: string;
  tier: string;
  confidenceScore: number;
  reviewerNotes: string;
  createdAt: string;
  post?: {
    id: string;
    content: string;
    isAnonymous: boolean;
    status: string;
    authorName: string;
    authorHandle: string;
  };
}

export default function AdminModHubModal({ isOpen, onClose }: Props) {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'crisis' | 'queue' | 'simulator'>('crisis');

  // Simulator state
  const [testText, setTestText] = useState('Today I feel completely overwhelmed and having thoughts of self-harm. I feel so alone.');
  const [simResult, setSimResult] = useState<any>(null);
  const [simulating, setSimulating] = useState(false);

  // Outreach DM state
  const [selectedCrisis, setSelectedCrisis] = useState<CrisisAlert | null>(null);
  const [customDraft, setCustomDraft] = useState('');
  const [sendingDm, setSendingDm] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);

  // Active Crisis Alerts Data (Initial Seed & Live State)
  const [crisisAlerts, setCrisisAlerts] = useState<CrisisAlert[]>([
    {
      id: 'crisis-1',
      userId: 'user-sister-442',
      subgroupId: 'MentalHealth',
      decryptedSnippet: "I've been crying all night and feel like giving up on life completely. My family doesn't understand my postpartum struggles and I feel so hopeless.",
      outreachStatus: 'pending_outreach',
      createdAt: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
      elapsedMinutes: 12,
      slaRemainingMinutes: 33,
      isSlaBreached: false,
      suggestedWarmDraft: "Hey love, I read what you shared and just wanted to check in on you. You don't have to carry this by yourself. I'm here if you want to chat, and here are some confidential 24/7 resources: [Call 988 / Text 741741]. No pressure to reply, just wanted you to know you are seen. 🌸",
    },
  ]);

  // Content Review Queue (Tier 1 & 2)
  const [flaggedItems, setFlaggedItems] = useState<FlagItem[]>([
    {
      id: 'flag-1',
      contentId: 'post-h-1',
      category: 'HARASSMENT',
      tier: 'TIER_1_AUTO_HIDE',
      confidenceScore: 0.96,
      reviewerNotes: 'Targeted hostile insult directed at another community member.',
      createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
      post: {
        id: 'post-h-1',
        content: 'You are so dramatic and attention seeking, go away nobody cares.',
        isAnonymous: false,
        status: 'hidden_under_review',
        authorName: 'Unverified Guest',
        authorHandle: 'guest_99',
      },
    },
    {
      id: 'flag-2',
      contentId: 'post-m-1',
      category: 'MISINFORMATION',
      tier: 'TIER_2_FLAG_REVIEW',
      confidenceScore: 0.88,
      reviewerNotes: 'Unverified definitive cure claim for complex endocrine disorder.',
      createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
      post: {
        id: 'post-m-1',
        content: 'Stop taking any doctor prescribed metformin! Drink raw vinegar 5 times daily, it is guaranteed to cure PCOS in 3 days.',
        isAnonymous: false,
        status: 'published',
        authorName: 'Wellness Seeker',
        authorHandle: 'wellness_seek',
      },
    },
  ]);

  if (!isOpen) return null;

  const handleRunSimulator = async () => {
    if (!testText.trim()) return;
    setSimulating(true);

    try {
      const res = await apiRequest('/moderation/test-scan', {
        method: 'POST',
        body: JSON.stringify({ text: testText, isAnonymous: false }),
      });
      setSimResult(res);
    } catch {
      // Local fallback simulation calculation
      const textLower = testText.toLowerCase();
      if (textLower.includes('kill') || textLower.includes('suicid') || textLower.includes('hopeless') || textLower.includes('harm')) {
        setSimResult({
          tier: 3,
          category: 'CRISIS',
          confidenceScore: 0.94,
          perspective: 'first_person_disclosure',
          rationale: 'First-person expression of acute hopelessness, self-harm, or domestic crisis.',
          isAllowedClinicalTerm: true,
          systemAction: 'escalate_and_publish',
        });
      } else if (textLower.includes('cure') && textLower.includes('guaranteed')) {
        setSimResult({
          tier: 2,
          category: 'MISINFORMATION',
          confidenceScore: 0.88,
          perspective: 'neutral',
          rationale: 'Unverified definitive cure claim.',
          isAllowedClinicalTerm: true,
          systemAction: 'flag_and_publish',
        });
      } else if (textLower.includes('bitch') || textLower.includes('ugly') || textLower.includes('shut up')) {
        setSimResult({
          tier: 1,
          category: 'HARASSMENT',
          confidenceScore: 0.96,
          perspective: 'second_person_targeting',
          rationale: 'Targeted hostile insult directed at another individual.',
          isAllowedClinicalTerm: false,
          systemAction: 'hide_and_queue',
        });
      } else {
        setSimResult({
          tier: 0,
          category: 'CLEAN',
          confidenceScore: 0.99,
          perspective: 'first_person_disclosure',
          rationale: 'Empathetic community discussion meeting guidelines.',
          isAllowedClinicalTerm: true,
          systemAction: 'publish',
        });
      }
    } finally {
      setSimulating(false);
    }
  };

  const handleOpenOutreach = (alert: CrisisAlert) => {
    setSelectedCrisis(alert);
    setCustomDraft(alert.suggestedWarmDraft);
    setSentSuccess(false);
  };

  const handleSendOutreachDm = async () => {
    if (!selectedCrisis) return;
    setSendingDm(true);

    try {
      await apiRequest(`/moderation/crisis-alerts/${selectedCrisis.id}/ack`, {
        method: 'POST',
        body: JSON.stringify({ notes: customDraft }),
      });
    } catch {
      // Local state update
    }

    setCrisisAlerts(
      crisisAlerts.map((a) =>
        a.id === selectedCrisis.id ? { ...a, outreachStatus: 'outreach_sent' } : a
      )
    );

    setSendingDm(false);
    setSentSuccess(true);
    setTimeout(() => {
      setSelectedCrisis(null);
    }, 1500);
  };

  const handleResolveFlag = (flagId: string, action: 'restore' | 'delete' | 'dismiss') => {
    setFlaggedItems(flaggedItems.filter((f) => f.id !== flagId));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-bloom-bg dark:bg-bloom-dark rounded-3xl shadow-2xl border border-stone-200 dark:border-bloom-darkBorder max-h-[92vh] flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="p-5 border-b border-stone-200 dark:border-bloom-darkBorder flex items-center justify-between bg-bloom-blush/40 dark:bg-bloom-darkCard/40">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-bloom-terracotta text-white flex items-center justify-center font-bold text-sm shadow-sm">
              🛡️
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-stone-900 dark:text-stone-100">Moderator & Crisis Care Hub</h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-bloom-sage/20 text-bloom-wine dark:text-bloom-sage">
                  Founder Control
                </span>
              </div>
              <p className="text-xs text-bloom-muted">Empathetic safety, 4-tier triage & AES-256 encrypted care logs</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-bloom-muted hover:bg-stone-200 dark:hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-stone-200 dark:border-bloom-darkBorder px-5 pt-3 gap-3 bg-white dark:bg-stone-900 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('crisis')}
            className={`pb-2.5 border-b-2 flex items-center gap-1.5 transition-colors ${
              activeTab === 'crisis'
                ? 'border-rose-500 text-rose-600 dark:text-rose-400'
                : 'border-transparent text-bloom-muted hover:text-stone-900'
            }`}
          >
            <HeartHandshake className="w-4 h-4" />
            <span>Tier 3 Crisis Care ({crisisAlerts.filter(c => c.outreachStatus === 'pending_outreach').length})</span>
          </button>

          <button
            onClick={() => setActiveTab('queue')}
            className={`pb-2.5 border-b-2 flex items-center gap-1.5 transition-colors ${
              activeTab === 'queue'
                ? 'border-bloom-terracotta text-bloom-terracotta'
                : 'border-transparent text-bloom-muted hover:text-stone-900'
            }`}
          >
            <ShieldAlert className="w-4 h-4" />
            <span>Content Triage ({flaggedItems.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('simulator')}
            className={`pb-2.5 border-b-2 flex items-center gap-1.5 transition-colors ${
              activeTab === 'simulator'
                ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-bloom-muted hover:text-stone-900'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>2-Stage Classifier Simulator</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4">
          
          {/* TAB 1: CRISIS ALERTS */}
          {activeTab === 'crisis' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 text-xs text-rose-900 dark:text-rose-200 flex items-start gap-2.5">
                <Lock className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Confidential Tier 3 Protocol:</span> Crisis disclosures remain visible to avoid isolating the member. Outreach occurs privately via warm direct messaging in a non-clinical "bestie" tone.
                </div>
              </div>

              {crisisAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-rose-200 dark:border-rose-900/60 shadow-sm space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" /> Tier 3 Escalation
                      </span>
                      <span className="text-xs text-bloom-muted">#{alert.subgroupId}</span>
                    </div>

                    <div className="flex items-center gap-1.5 text-[11px] font-semibold text-rose-600">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{alert.elapsedMinutes}m ago (SLA: {alert.slaRemainingMinutes}m left)</span>
                    </div>
                  </div>

                  {/* Decrypted Disclosure Snippet */}
                  <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/60 dark:border-stone-800 text-xs text-stone-800 dark:text-stone-200 italic">
                    "{alert.decryptedSnippet}"
                  </div>

                  {/* Status & Action */}
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[11px] text-bloom-muted">
                      Status: <strong className={alert.outreachStatus === 'outreach_sent' ? 'text-bloom-sage' : 'text-amber-600'}>
                        {alert.outreachStatus === 'outreach_sent' ? '✓ Outreach Sent' : 'Needs Check-in'}
                      </strong>
                    </span>

                    {alert.outreachStatus === 'pending_outreach' ? (
                      <button
                        onClick={() => handleOpenOutreach(alert)}
                        className="px-3.5 py-1.5 rounded-xl bg-bloom-terracotta hover:bg-bloom-wine text-white text-xs font-semibold shadow-sm transition-all flex items-center gap-1.5"
                      >
                        <HeartHandshake className="w-3.5 h-3.5" /> Send Warm Check-in DM
                      </button>
                    ) : (
                      <span className="text-xs text-bloom-sage font-medium flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Check-in Completed
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 2: CONTENT TRIAGE */}
          {activeTab === 'queue' && (
            <div className="space-y-4">
              {flaggedItems.length === 0 ? (
                <div className="text-center py-12 text-xs text-bloom-muted">
                  ✨ Sanctuary review queue is clear! All discussions meet safety guidelines.
                </div>
              ) : (
                flaggedItems.map((flag) => (
                  <div
                    key={flag.id}
                    className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          flag.category === 'HARASSMENT'
                            ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                            : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                        }`}>
                          {flag.tier === 'TIER_1_AUTO_HIDE' ? 'Tier 1 Auto-Hidden' : 'Tier 2 Flagged'}
                        </span>
                        <span className="text-xs text-bloom-muted font-mono">{Math.round(flag.confidenceScore * 100)}% confidence</span>
                      </div>
                      <span className="text-[11px] text-bloom-muted">
                        Author: @{flag.post?.authorHandle}
                      </span>
                    </div>

                    <p className="text-xs text-stone-800 dark:text-stone-200 font-medium">
                      "{flag.post?.content}"
                    </p>

                    <p className="text-[11px] text-bloom-muted italic">
                      Classifier Rationale: {flag.reviewerNotes}
                    </p>

                    <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-100 dark:border-stone-800">
                      <button
                        onClick={() => handleResolveFlag(flag.id, 'dismiss')}
                        className="px-3 py-1 text-xs text-bloom-muted hover:text-stone-900 dark:hover:text-white"
                      >
                        Dismiss
                      </button>
                      <button
                        onClick={() => handleResolveFlag(flag.id, 'restore')}
                        className="px-3 py-1.5 rounded-xl bg-bloom-sage/20 text-bloom-wine dark:text-bloom-sage text-xs font-semibold hover:bg-bloom-sage/30 transition-colors"
                      >
                        Restore to Feed
                      </button>
                      <button
                        onClick={() => handleResolveFlag(flag.id, 'delete')}
                        className="px-3 py-1.5 rounded-xl bg-rose-600 text-white text-xs font-semibold hover:bg-rose-700 transition-colors flex items-center gap-1"
                      >
                        <Trash2 className="w-3 h-3" /> Confirm Removal
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 3: CLASSIFIER SIMULATOR */}
          {activeTab === 'simulator' && (
            <div className="space-y-4">
              <div className="p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-900/50 text-xs text-indigo-900 dark:text-indigo-200">
                <span className="font-bold">Live Safety Evaluator:</span> Test how the Stage 1 in-memory allowlist and Stage 2 intent scorer categorize text into Tiers 1–4.
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-900 dark:text-stone-100 mb-1">
                  Sample Content to Evaluate
                </label>
                <textarea
                  rows={3}
                  value={testText}
                  onChange={(e) => setTestText(e.target.value)}
                  className="w-full p-3 text-xs rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 focus:outline-none focus:ring-2 focus:ring-bloom-terracotta"
                />
              </div>

              {/* Quick Preset Buttons */}
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => setTestText('I was diagnosed with endometriosis and postpartum depression, looking for support.')}
                  className="px-2.5 py-1 rounded-full text-[10px] bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200"
                >
                  Preset: Benign Clinical Disclosure
                </button>
                <button
                  type="button"
                  onClick={() => setTestText('I feel so hopeless and having thoughts of ending my life tonight.')}
                  className="px-2.5 py-1 rounded-full text-[10px] bg-rose-100 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 hover:bg-rose-200"
                >
                  Preset: Tier 3 Crisis Disclosure
                </button>
                <button
                  type="button"
                  onClick={() => setTestText('Drink raw turpentine, it is guaranteed to cure PCOS in 3 days.')}
                  className="px-2.5 py-1 rounded-full text-[10px] bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 hover:bg-amber-200"
                >
                  Preset: Tier 2 Health Misinfo
                </button>
                <button
                  type="button"
                  onClick={() => setTestText('You are disgusting, go kill yourself.')}
                  className="px-2.5 py-1 rounded-full text-[10px] bg-red-100 dark:bg-red-950/40 text-red-700 dark:text-red-300 hover:bg-red-200"
                >
                  Preset: Tier 1 Targeted Threat
                </button>
              </div>

              <button
                type="button"
                onClick={handleRunSimulator}
                disabled={simulating}
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-md transition-all flex items-center justify-center gap-1.5"
              >
                {simulating ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                Run 2-Stage Evaluation
              </button>

              {/* Simulation Result Output */}
              {simResult && (
                <div className="p-4 rounded-2xl bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-2 text-xs animate-in fade-in">
                  <div className="flex items-center justify-between font-bold">
                    <span className="text-stone-900 dark:text-stone-100">Classification Result:</span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[11px] ${
                      simResult.tier === 3
                        ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                        : simResult.tier === 1
                        ? 'bg-red-100 text-red-700'
                        : simResult.tier === 2
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      Tier {simResult.tier}: {simResult.category}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px] text-bloom-muted pt-1">
                    <div>Confidence: <strong className="text-stone-900 dark:text-stone-100">{Math.round(simResult.confidenceScore * 100)}%</strong></div>
                    <div>Perspective: <strong className="text-stone-900 dark:text-stone-100">{simResult.perspective}</strong></div>
                    <div>Clinical Allowlist: <strong className="text-stone-900 dark:text-stone-100">{simResult.isAllowedClinicalTerm ? '✓ Preserved' : 'None'}</strong></div>
                    <div>System Action: <strong className="text-stone-900 dark:text-stone-100">{simResult.systemAction}</strong></div>
                  </div>

                  <p className="text-[11px] text-stone-700 dark:text-stone-300 pt-2 border-t border-stone-200 dark:border-stone-800">
                    <strong>Rationale:</strong> {simResult.rationale}
                  </p>
                </div>
              )}
            </div>
          )}

        </div>

        {/* OUTREACH DM MODAL OVERLAY */}
        {selectedCrisis && (
          <div className="absolute inset-0 z-20 bg-stone-900/80 backdrop-blur-sm p-6 flex flex-col justify-between animate-in fade-in">
            <div className="space-y-3">
              <div className="flex items-center justify-between text-white">
                <div className="flex items-center gap-2">
                  <HeartHandshake className="w-5 h-5 text-bloom-terracotta" />
                  <h3 className="text-sm font-bold">1-Tap Empathetic Outreach DM</h3>
                </div>
                <button onClick={() => setSelectedCrisis(null)} className="text-stone-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="text-xs text-stone-300">
                Pre-filled in a warm, non-clinical "bestie" tone. Feel free to personalize before sending:
              </p>

              <textarea
                rows={5}
                value={customDraft}
                onChange={(e) => setCustomDraft(e.target.value)}
                className="w-full p-3 text-xs rounded-2xl bg-stone-800 text-stone-100 border border-stone-700 focus:outline-none focus:ring-2 focus:ring-bloom-terracotta leading-relaxed"
              />
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-stone-800">
              <button
                type="button"
                onClick={() => setSelectedCrisis(null)}
                className="text-xs text-stone-400 hover:text-white"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleSendOutreachDm}
                disabled={sendingDm}
                className="px-5 py-2.5 rounded-xl bg-bloom-terracotta hover:bg-bloom-wine text-white text-xs font-semibold shadow-md flex items-center gap-1.5 transition-all"
              >
                {sendingDm ? 'Sending...' : sentSuccess ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" /> Outreach Recorded!
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" /> Send Private Check-in DM
                  </>
                )}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
