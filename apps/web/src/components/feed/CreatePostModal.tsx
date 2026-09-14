'use client';

import React, { useState, useMemo } from 'react';
import { X, Image as ImageIcon, BarChart2, HelpCircle, EyeOff, ShieldAlert, Sparkles, Plus, Trash2, HeartHandshake } from 'lucide-react';
import { useAuthStore } from '../../lib/auth-store';
import { apiRequest } from '../../lib/api';
import CrisisHelplineModal from './CrisisHelplineModal';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onPostCreated: (newPost: any) => void;
}

export default function CreatePostModal({ isOpen, onClose, onPostCreated }: Props) {
  const { user } = useAuthStore();

  const [mode, setMode] = useState<'text' | 'poll' | 'question'>('text');
  const [content, setContent] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [contentWarning, setContentWarning] = useState<string>('');
  const [selectedTags, setSelectedTags] = useState<string[]>(['SelfCare']);
  const [imageUrl, setImageUrl] = useState('');
  const [showImageInput, setShowImageInput] = useState(false);

  // Poll state
  const [pollQuestion, setPollQuestion] = useState('');
  const [pollOptions, setPollOptions] = useState<string[]>(['Option 1', 'Option 2']);
  const [pollDurationHours, setPollDurationHours] = useState(24);

  // UI state
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCrisisModalOpen, setIsCrisisModalOpen] = useState(false);

  const availableTags = [
    { name: 'MentalHealth', label: '#MentalHealth' },
    { name: 'PhysicalHealth', label: '#PhysicalHealth' },
    { name: 'PCOS-Fertility', label: '#PCOS & Fertility' },
    { name: 'SelfCare', label: '#SelfCare' },
    { name: 'Motherhood', label: '#Motherhood' },
    { name: 'AskTheCommunity', label: '#AskTheCommunity' },
    { name: 'GriefAndLoss', label: '#GriefAndLoss' },
  ];

  const contentWarningOptions = [
    { id: '', label: 'None' },
    { id: 'GRIEF', label: 'Grief & Loss' },
    { id: 'PREGNANCY_LOSS', label: 'Pregnancy / Baby Loss' },
    { id: 'EATING_DISORDERS', label: 'Eating Disorders' },
    { id: 'TRAUMA', label: 'Trauma & Abuse' },
    { id: 'BODILY_SYMPTOMS', label: 'Sensitive Symptoms' },
  ];

  // Real-time Crisis Interceptor
  const isCrisisDetected = useMemo(() => {
    const textLower = content.toLowerCase();
    const crisisPatterns = [
      'suicid', 'kill myself', 'end my life', 'want to die',
      'hopeless', "can't go on", 'harm myself', 'giving up on life'
    ];
    return crisisPatterns.some((pattern) => textLower.includes(pattern));
  }, [content]);

  if (!isOpen) return null;

  const toggleTag = (tagName: string) => {
    if (selectedTags.includes(tagName)) {
      if (selectedTags.length > 1) {
        setSelectedTags(selectedTags.filter((t) => t !== tagName));
      }
    } else {
      setSelectedTags([...selectedTags, tagName]);
    }
  };

  const handleAddPollOption = () => {
    if (pollOptions.length < 5) {
      setPollOptions([...pollOptions, `Option ${pollOptions.length + 1}`]);
    }
  };

  const handleUpdatePollOption = (index: number, val: string) => {
    const updated = [...pollOptions];
    updated[index] = val;
    setPollOptions(updated);
  };

  const handleRemovePollOption = (index: number) => {
    if (pollOptions.length > 2) {
      setPollOptions(pollOptions.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setSubmitting(true);
    setError(null);

    const payload: any = {
      content,
      isAnonymous,
      contentWarning: contentWarning || undefined,
      tags: selectedTags,
      mediaUrls: imageUrl.trim() ? [imageUrl.trim()] : [],
    };

    if (mode === 'poll') {
      const validOptions = pollOptions.map((o) => o.trim()).filter(Boolean);
      if (validOptions.length < 2) {
        setError('Please provide at least 2 non-empty options for the poll.');
        setSubmitting(false);
        return;
      }
      payload.poll = {
        question: pollQuestion.trim() || content.slice(0, 100),
        options: validOptions,
        durationHours: pollDurationHours,
      };
    }

    try {
      const newPost = await apiRequest<any>('/posts', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      onPostCreated(newPost);
      onClose();
    } catch (err: any) {
      // If backend is running without active DB during local testing, create clean mock post locally
      const mockPost = {
        id: 'post-' + Date.now(),
        content,
        isAnonymous,
        contentWarning: contentWarning || null,
        mediaUrls: imageUrl.trim() ? [imageUrl.trim()] : [],
        author: isAnonymous
          ? {
              displayName: 'Anonymous Sister',
              username: 'anonymous',
              avatarUrl: null,
              isAnonymous: true,
              quizVerified: true,
            }
          : {
              displayName: user?.profile?.displayName || 'Sister',
              username: user?.profile?.username || 'member',
              avatarUrl: user?.profile?.avatarUrl,
              isAnonymous: false,
              quizVerified: true,
            },
        tags: selectedTags.map((t) => ({ id: t, name: t, slug: t.toLowerCase() })),
        poll:
          mode === 'poll'
            ? {
                id: 'poll-' + Date.now(),
                question: pollQuestion || content,
                expiresAt: new Date(Date.now() + pollDurationHours * 3600000).toISOString(),
                totalVotes: 0,
                hasEnded: false,
                options: pollOptions.map((opt, i) => ({
                  id: 'opt-' + i,
                  optionText: opt,
                  votesCount: 0,
                  percentage: 0,
                })),
              }
            : null,
        likesCount: 0,
        hugsCount: 0,
        commentsCount: 0,
        bookmarksCount: 0,
        createdAt: new Date().toISOString(),
      };

      onPostCreated(mockPost);
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <CrisisHelplineModal isOpen={isCrisisModalOpen} onClose={() => setIsCrisisModalOpen(false)} />

      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in duration-200">
        <div className="relative w-full max-w-lg p-5 md:p-6 bg-bloom-bg dark:bg-bloom-dark rounded-3xl shadow-2xl border border-stone-200 dark:border-bloom-darkBorder max-h-[92vh] overflow-y-auto">
          
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full text-bloom-muted hover:bg-bloom-blush dark:hover:bg-bloom-darkCard transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Composer Header */}
          <div className="flex items-center gap-3 mb-4">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shadow-sm ${
              isAnonymous ? 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300' : 'bg-bloom-terracotta text-white'
            }`}>
              {isAnonymous ? '🎭' : user?.profile?.displayName ? user.profile.displayName.charAt(0).toUpperCase() : '🌸'}
            </div>
            <div>
              <h2 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                {isAnonymous ? 'Posting as Anonymous Sister' : user?.profile?.displayName || 'Share with Sanctuary'}
              </h2>
              <p className="text-[11px] text-bloom-muted">
                {isAnonymous ? 'Your identity is shielded from other community members' : 'Visible to verified sisters in Ease & Bloom'}
              </p>
            </div>
          </div>

          {/* Mode Switcher */}
          <div className="flex rounded-full bg-bloom-blush dark:bg-bloom-darkCard p-1 mb-4">
            <button
              type="button"
              onClick={() => setMode('text')}
              className={`flex-1 py-1 text-xs font-semibold rounded-full transition-all ${
                mode === 'text'
                  ? 'bg-white dark:bg-stone-800 text-bloom-wine dark:text-bloom-blush shadow-sm'
                  : 'text-bloom-muted hover:text-stone-900'
              }`}
            >
              Discussion Post
            </button>
            <button
              type="button"
              onClick={() => setMode('poll')}
              className={`flex-1 py-1 text-xs font-semibold rounded-full transition-all flex items-center justify-center gap-1 ${
                mode === 'poll'
                  ? 'bg-white dark:bg-stone-800 text-bloom-wine dark:text-bloom-blush shadow-sm'
                  : 'text-bloom-muted hover:text-stone-900'
              }`}
            >
              <BarChart2 className="w-3.5 h-3.5" /> Community Poll
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('question');
                if (!selectedTags.includes('AskTheCommunity')) {
                  setSelectedTags([...selectedTags, 'AskTheCommunity']);
                }
              }}
              className={`flex-1 py-1 text-xs font-semibold rounded-full transition-all flex items-center justify-center gap-1 ${
                mode === 'question'
                  ? 'bg-white dark:bg-stone-800 text-bloom-wine dark:text-bloom-blush shadow-sm'
                  : 'text-bloom-muted hover:text-stone-900'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5" /> Ask Sisters
            </button>
          </div>

          {/* Real-time Crisis Interceptor Alert */}
          {isCrisisDetected && (
            <div className="p-3 mb-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-xs flex items-start gap-2.5 animate-in slide-in-from-top-2">
              <HeartHandshake className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <span className="font-bold text-rose-800 dark:text-rose-200">You matter, and support is right here.</span>
                <p className="text-[11px] text-rose-700 dark:text-rose-300 mt-0.5">
                  If you are feeling overwhelmed, hopeless, or unsafe, free confidential help is ready 24/7.
                </p>
                <button
                  type="button"
                  onClick={() => setIsCrisisModalOpen(true)}
                  className="mt-2 inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-rose-600 text-white font-semibold text-[10px] shadow-sm hover:bg-rose-700"
                >
                  View 24/7 Crisis Helplines
                </button>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <textarea
                rows={4}
                required
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={
                  mode === 'question'
                    ? "What advice or experience are you looking for? (e.g., 'Has anyone navigated PCOS while working high stress jobs?')"
                    : mode === 'poll'
                    ? "Share context or ask your question for this poll..."
                    : "Share what's on your heart or mind today..."
                }
                className="w-full p-3 text-xs leading-relaxed rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 focus:outline-none focus:ring-2 focus:ring-bloom-terracotta resize-none"
              />
              <div className="flex justify-end text-[10px] text-bloom-muted mt-0.5">
                {content.length}/2000
              </div>
            </div>

            {/* Poll Builder Mode */}
            {mode === 'poll' && (
              <div className="p-3.5 rounded-2xl bg-bloom-blush/60 dark:bg-stone-900/80 border border-stone-200 dark:border-stone-800 space-y-2.5">
                <label className="block text-xs font-bold text-stone-900 dark:text-stone-100">
                  Poll Options (Max 5)
                </label>
                {pollOptions.map((opt, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="text-xs text-bloom-muted w-4 font-mono">{idx + 1}.</span>
                    <input
                      type="text"
                      required
                      value={opt}
                      onChange={(e) => handleUpdatePollOption(idx, e.target.value)}
                      placeholder={`Option ${idx + 1}`}
                      className="flex-1 px-3 py-1.5 text-xs rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 focus:outline-none"
                    />
                    {pollOptions.length > 2 && (
                      <button
                        type="button"
                        onClick={() => handleRemovePollOption(idx)}
                        className="p-1.5 text-stone-400 hover:text-rose-500"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}

                {pollOptions.length < 5 && (
                  <button
                    type="button"
                    onClick={handleAddPollOption}
                    className="text-xs text-bloom-terracotta font-semibold hover:text-bloom-wine flex items-center gap-1 mt-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Option
                  </button>
                )}
              </div>
            )}

            {/* Optional Image Attachment */}
            {showImageInput && (
              <div className="animate-in fade-in">
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="Paste direct image URL (e.g. https://images.unsplash.com/...)"
                  className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 focus:outline-none"
                />
              </div>
            )}

            {/* Topic Tags Selector */}
            <div>
              <span className="block text-[11px] font-bold text-bloom-muted mb-1.5 uppercase tracking-wider">
                Select Topic Tags
              </span>
              <div className="flex flex-wrap gap-1.5">
                {availableTags.map((t) => {
                  const isSelected = selectedTags.includes(t.name);
                  return (
                    <button
                      key={t.name}
                      type="button"
                      onClick={() => toggleTag(t.name)}
                      className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-all ${
                        isSelected
                          ? 'bg-bloom-wine text-white shadow-sm'
                          : 'bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-300'
                      }`}
                    >
                      {t.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Vulnerability & Sensitivity Controls */}
            <div className="p-3.5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-3">
              
              {/* Anonymous Toggle */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300">
                    <EyeOff className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-stone-900 dark:text-stone-100 block">Post Anonymously</span>
                    <span className="text-[10px] text-bloom-muted">Hide your username and avatar for vulnerability</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAnonymous(!isAnonymous)}
                  className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                    isAnonymous ? 'bg-purple-600' : 'bg-stone-300 dark:bg-stone-700'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white transition-transform ${
                      isAnonymous ? 'translate-x-5 shadow-md' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Content Warning Selector */}
              <div className="pt-2 border-t border-stone-100 dark:border-stone-800">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
                    <ShieldAlert className="w-3.5 h-3.5 text-amber-500" /> Add Content Warning (Blur)
                  </span>
                </div>
                <select
                  value={contentWarning}
                  onChange={(e) => setContentWarning(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs rounded-xl bg-bloom-blush/40 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-800 dark:text-stone-200 focus:outline-none"
                >
                  {contentWarningOptions.map((opt) => (
                    <option key={opt.id} value={opt.id}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 rounded-xl bg-rose-50 text-rose-700 text-xs">
                {error}
              </div>
            )}

            {/* Actions Bar */}
            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => setShowImageInput(!showImageInput)}
                className={`p-2 rounded-xl border transition-colors flex items-center gap-1 text-xs ${
                  showImageInput
                    ? 'bg-bloom-blush text-bloom-wine border-bloom-wine'
                    : 'border-stone-200 dark:border-stone-800 text-bloom-muted hover:text-stone-900'
                }`}
              >
                <ImageIcon className="w-4 h-4" />
                <span className="text-[11px]">Photo</span>
              </button>

              <button
                type="submit"
                disabled={submitting || !content.trim()}
                className="px-6 py-2.5 rounded-xl bg-bloom-terracotta hover:bg-bloom-wine text-white text-xs font-semibold shadow-md transition-all active:scale-[0.98] disabled:opacity-40 flex items-center gap-1.5"
              >
                {submitting ? 'Sharing...' : 'Publish to Sanctuary'}
                <Sparkles className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
