'use client';

import React, { useState } from 'react';
import { Heart, Sparkles, MessageCircle, Bookmark, Eye, EyeOff, ShieldAlert, Info, Check, Share2 } from 'lucide-react';
import { Post } from '../../lib/types';
import { apiRequest } from '../../lib/api';
import { useAuthStore } from '../../lib/auth-store';

interface Props {
  post: Post;
  onPostUpdated?: (updated: Post) => void;
}

export default function PostCard({ post, onPostUpdated }: Props) {
  const { user, isAuthenticated, openAuthModal, openQuizModal } = useAuthStore();

  const [isCwRevealed, setIsCwRevealed] = useState(!post.contentWarning);
  const [likesCount, setLikesCount] = useState(post.likesCount);
  const [hasLiked, setHasLiked] = useState(post.hasLiked || false);
  const [hugsCount, setHugsCount] = useState(post.hugsCount);
  const [hasSentHug, setHasSentHug] = useState(post.hasSentHug || false);
  const [hasBookmarked, setHasBookmarked] = useState(post.hasBookmarked || false);
  const [poll, setPoll] = useState(post.poll);
  const [voting, setVoting] = useState(false);

  const requireAuth = (callback: () => void) => {
    if (!isAuthenticated) {
      openAuthModal('register');
      return;
    }
    if (!user?.quizVerified) {
      openQuizModal();
      return;
    }
    callback();
  };

  const handleLike = () => {
    requireAuth(() => {
      setHasLiked((prev) => !prev);
      setLikesCount((prev) => (hasLiked ? prev - 1 : prev + 1));
    });
  };

  const handleSendHug = () => {
    requireAuth(() => {
      setHasSentHug((prev) => !prev);
      setHugsCount((prev) => (hasSentHug ? prev - 1 : prev + 1));
    });
  };

  const handleVotePoll = async (optionId: string) => {
    requireAuth(async () => {
      if (!poll || poll.userVotedOptionId || poll.hasEnded || voting) return;
      setVoting(true);

      // Optimistic vote update
      const total = poll.totalVotes + 1;
      const updatedOptions = poll.options.map((opt) => {
        const count = opt.id === optionId ? opt.votesCount + 1 : opt.votesCount;
        return {
          ...opt,
          votesCount: count,
          percentage: Math.round((count / total) * 100),
        };
      });

      setPoll({
        ...poll,
        totalVotes: total,
        userVotedOptionId: optionId,
        options: updatedOptions,
      });

      try {
        await apiRequest(`/posts/${post.id}/poll/vote`, {
          method: 'POST',
          body: JSON.stringify({ optionId }),
        });
      } catch (err) {
        // Vote registered locally
      } finally {
        setVoting(false);
      }
    });
  };

  return (
    <article className="p-4 md:p-5 hover:bg-stone-50/40 dark:hover:bg-bloom-darkCard/20 transition-colors border-b border-stone-200/80 dark:border-bloom-darkBorder">
      <div className="flex items-start gap-3">
        
        {/* Author Avatar */}
        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 shadow-sm ${
          post.isAnonymous
            ? 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300'
            : 'bg-bloom-blush text-bloom-wine dark:bg-stone-800 dark:text-bloom-blush'
        }`}>
          {post.isAnonymous ? '🎭' : post.author.avatarUrl ? (
            <img src={post.author.avatarUrl} alt={post.author.displayName} className="w-full h-full rounded-full object-cover" />
          ) : (
            post.author.displayName.charAt(0).toUpperCase()
          )}
        </div>

        {/* Post Body */}
        <div className="flex-1 min-w-0">
          
          {/* Author Meta */}
          <div className="flex items-center justify-between gap-1">
            <div className="flex items-center gap-1.5 truncate">
              <span className="font-semibold text-sm text-stone-900 dark:text-stone-100 truncate">
                {post.author.displayName}
              </span>
              <span className="text-xs text-bloom-muted truncate">
                {post.isAnonymous ? '·' : `@${post.author.username} ·`} 2h
              </span>
            </div>

            {/* Badges */}
            <div className="flex items-center gap-1">
              {post.isAnonymous && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-purple-100 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300">
                  Anonymous
                </span>
              )}
              {post.contentWarning && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 flex items-center gap-0.5">
                  <ShieldAlert className="w-3 h-3" /> CW: {post.contentWarning.replace('_', ' ')}
                </span>
              )}
            </div>
          </div>

          {/* Content Warning Blur Gate */}
          {post.contentWarning && !isCwRevealed ? (
            <div className="my-3 p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-900/40 text-center">
              <p className="text-xs text-amber-900 dark:text-amber-200 font-medium mb-2">
                This post mentions sensitive themes ({post.contentWarning.replace('_', ' ')}).
              </p>
              <button
                type="button"
                onClick={() => setIsCwRevealed(true)}
                className="px-3 py-1.5 rounded-xl bg-amber-700 hover:bg-amber-800 text-white text-[11px] font-semibold transition-colors inline-flex items-center gap-1"
              >
                <Eye className="w-3.5 h-3.5" /> View Post Content
              </button>
            </div>
          ) : (
            <>
              {/* Post Content */}
              <p className="mt-2 text-sm text-stone-800 dark:text-stone-200 leading-relaxed whitespace-pre-line">
                {post.content}
              </p>

              {/* Photo Embed */}
              {post.mediaUrls && post.mediaUrls.length > 0 && (
                <div className="mt-3 rounded-2xl overflow-hidden border border-stone-200 dark:border-stone-800 max-h-80">
                  <img
                    src={post.mediaUrls[0]}
                    alt="Post attachment"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Interactive Poll */}
              {poll && (
                <div className="mt-3.5 p-3.5 rounded-2xl bg-bloom-blush/40 dark:bg-stone-900/80 border border-stone-200/80 dark:border-stone-800">
                  <div className="flex items-center justify-between text-xs text-bloom-muted mb-2.5">
                    <span className="font-semibold text-stone-800 dark:text-stone-200">{poll.question}</span>
                    <span className="text-[11px]">{poll.totalVotes} votes</span>
                  </div>

                  <div className="space-y-2">
                    {poll.options.map((opt) => {
                      const isUserVote = poll.userVotedOptionId === opt.id;
                      const showResults = Boolean(poll.userVotedOptionId || poll.hasEnded);

                      return (
                        <button
                          key={opt.id}
                          disabled={showResults}
                          onClick={() => handleVotePoll(opt.id)}
                          className={`relative w-full text-left p-2.5 rounded-xl text-xs overflow-hidden border transition-all ${
                            showResults
                              ? 'border-stone-200 dark:border-stone-800 bg-white/60 dark:bg-stone-800/40'
                              : 'border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 hover:border-bloom-terracotta'
                          }`}
                        >
                          {/* Percentage fill bar */}
                          {showResults && (
                            <div
                              className={`absolute inset-y-0 left-0 transition-all duration-500 rounded-xl ${
                                isUserVote
                                  ? 'bg-bloom-terracotta/20 dark:bg-bloom-terracotta/30'
                                  : 'bg-stone-200/50 dark:bg-stone-700/30'
                              }`}
                              style={{ width: `${opt.percentage}%` }}
                            />
                          )}

                          <div className="relative flex items-center justify-between z-10">
                            <span className={`flex items-center gap-1.5 font-medium ${isUserVote ? 'text-bloom-wine dark:text-bloom-blush font-bold' : ''}`}>
                              {opt.optionText}
                              {isUserVote && <Check className="w-3.5 h-3.5 text-bloom-terracotta" />}
                            </span>
                            {showResults && (
                              <span className="text-xs font-mono text-bloom-muted font-semibold ml-2">
                                {opt.percentage}%
                              </span>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </>
          )}

          {/* Topic Tags Pills */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {post.tags.map((t) => (
                <span
                  key={t.id}
                  className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300"
                >
                  #{t.name}
                </span>
              ))}
            </div>
          )}

          {/* Community Notes Callout (X-Style) */}
          {post.communityNotes && post.communityNotes.length > 0 && (
            <div className="mt-3 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-800/40 text-xs">
              <div className="flex items-center gap-1.5 text-amber-900 dark:text-amber-300 font-semibold mb-1">
                <Info className="w-3.5 h-3.5" /> Community Context
              </div>
              <p className="text-amber-800 dark:text-amber-200/90 leading-normal">
                {post.communityNotes[0].summary}
              </p>
            </div>
          )}

          {/* Action Bar */}
          <div className="flex items-center justify-between mt-4 pt-1 text-bloom-muted text-xs max-w-sm">
            {/* Like / Heart */}
            <button
              onClick={handleLike}
              className={`flex items-center gap-1 transition-colors ${
                hasLiked ? 'text-rose-500 font-semibold' : 'hover:text-rose-500'
              }`}
            >
              <Heart className={`w-4 h-4 ${hasLiked ? 'fill-rose-500' : ''}`} />
              <span>{likesCount}</span>
            </button>

            {/* Hugs / Support */}
            <button
              onClick={handleSendHug}
              className={`flex items-center gap-1 transition-colors ${
                hasSentHug ? 'text-bloom-terracotta font-semibold' : 'hover:text-bloom-terracotta'
              }`}
            >
              <Sparkles className={`w-4 h-4 ${hasSentHug ? 'fill-bloom-terracotta' : ''}`} />
              <span>{hugsCount} Hugs</span>
            </button>

            {/* Comment */}
            <button className="flex items-center gap-1 hover:text-bloom-wine transition-colors">
              <MessageCircle className="w-4 h-4" />
              <span>{post.commentsCount}</span>
            </button>

            {/* Bookmark */}
            <button
              onClick={() => requireAuth(() => setHasBookmarked(!hasBookmarked))}
              className={`transition-colors ${
                hasBookmarked ? 'text-stone-900 dark:text-white' : 'hover:text-stone-900 dark:hover:text-white'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${hasBookmarked ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
