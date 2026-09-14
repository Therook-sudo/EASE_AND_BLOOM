'use client';

import React, { useState, useEffect } from 'react';
import { Compass, Shield, MessageCircle, User, Plus, CheckCircle2, Sparkles, Filter } from 'lucide-react';
import { useAuthStore } from '../lib/auth-store';
import { Post } from '../lib/types';
import { apiRequest } from '../lib/api';
import AuthModal from '../components/auth/AuthModal';
import SoftGateQuizModal from '../components/auth/SoftGateQuizModal';
import ProfileModal from '../components/auth/ProfileModal';
import CreatePostModal from '../components/feed/CreatePostModal';
import PostCard from '../components/feed/PostCard';

export default function HomeFeed() {
  const { user, isAuthenticated, openAuthModal, openQuizModal, openProfileModal, initialize } = useAuthStore();
  
  const [activeTab, setActiveTab] = useState('all');
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initialize();
    loadFeed(activeTab);
  }, [initialize, activeTab]);

  const topics = [
    { id: 'all', label: 'All Sanctuary' },
    { id: 'MentalHealth', label: '#MentalHealth' },
    { id: 'PCOS-Fertility', label: '#PCOS & Fertility' },
    { id: 'SelfCare', label: '#SelfCare' },
    { id: 'Motherhood', label: '#Motherhood' },
    { id: 'AskTheCommunity', label: '#AskTheCommunity' },
    { id: 'GriefAndLoss', label: '#GriefAndLoss' },
  ];

  const seedPosts: Post[] = [
    {
      id: 'post-seed-1',
      content: "Today I finally opened up about my PCOS journey with my family. It felt terrifying to be so honest about my body and fertility fears, but shedding that silence was liberating. Thank you to everyone here who shared advice last month! 🌸 #PCOS #SelfCare #Wellness",
      isAnonymous: false,
      author: {
        displayName: 'Sarah Johnson',
        username: 'sarah_j',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face',
        isAnonymous: false,
        quizVerified: true,
      },
      tags: [
        { id: 't1', name: 'PCOS', slug: 'pcos' },
        { id: 't2', name: 'SelfCare', slug: 'selfcare' },
      ],
      mediaUrls: [
        'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&auto=format&fit=crop&q=80',
      ],
      communityNotes: [
        {
          id: 'note-1',
          summary: 'PCOS affects 1 in 10 women globally. Lifestyle changes, gentle movement, and medical guidance can significantly support hormonal balance.',
        },
      ],
      likesCount: 38,
      hugsCount: 22,
      commentsCount: 14,
      bookmarksCount: 9,
      hasLiked: false,
      hasSentHug: false,
      createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    },
    {
      id: 'post-seed-2',
      content: "Has anyone tried natural cycle tracking & acupuncture for managing intense ovulation mood swings? Looking for gentle, natural ways to cope without feeling crazy. #PCOS-Fertility #MentalHealth",
      isAnonymous: true,
      author: {
        displayName: 'Anonymous Sister',
        username: 'anonymous',
        avatarUrl: null,
        isAnonymous: true,
        quizVerified: true,
      },
      tags: [
        { id: 't3', name: 'PCOS-Fertility', slug: 'pcos-fertility' },
        { id: 't4', name: 'MentalHealth', slug: 'mentalhealth' },
      ],
      mediaUrls: [],
      poll: {
        id: 'poll-seed-1',
        question: 'Which holistic practice has helped your hormonal mood swings most?',
        expiresAt: new Date(Date.now() + 86400000).toISOString(),
        totalVotes: 42,
        hasEnded: false,
        options: [
          { id: 'opt-1', optionText: 'Seed cycling & clean nutrition', votesCount: 18, percentage: 43 },
          { id: 'opt-2', optionText: 'Acupuncture & herbs', votesCount: 12, percentage: 29 },
          { id: 'opt-3', optionText: 'Somatic breathwork & yoga', votesCount: 10, percentage: 24 },
          { id: 'opt-4', optionText: 'None worked yet (seeking tips)', votesCount: 2, percentage: 4 },
        ],
      },
      likesCount: 29,
      hugsCount: 31,
      commentsCount: 18,
      bookmarksCount: 12,
      hasLiked: false,
      hasSentHug: false,
      createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    },
    {
      id: 'post-seed-3',
      content: "It has been 6 months since our miscarriage, and today was supposed to be my due date. The quiet grief hits in unexpected waves. Holding space for any sister walking through this silent heartbreak today. 🕊️",
      isAnonymous: true,
      contentWarning: 'PREGNANCY_LOSS',
      author: {
        displayName: 'Anonymous Sister',
        username: 'anonymous',
        avatarUrl: null,
        isAnonymous: true,
        quizVerified: true,
      },
      tags: [
        { id: 't5', name: 'GriefAndLoss', slug: 'griefandloss' },
        { id: 't6', name: 'Motherhood', slug: 'motherhood' },
      ],
      mediaUrls: [],
      likesCount: 54,
      hugsCount: 88,
      commentsCount: 32,
      bookmarksCount: 7,
      hasLiked: false,
      hasSentHug: false,
      createdAt: new Date(Date.now() - 3600000 * 8).toISOString(),
    },
  ];

  const loadFeed = async (tag: string) => {
    setLoading(true);
    try {
      const endpoint = tag === 'all' ? '/posts' : `/posts?tag=${tag}`;
      const res = await apiRequest<{ items: Post[] }>(endpoint);
      if (res.items && res.items.length > 0) {
        setPosts(res.items);
      } else {
        // Filter seed posts by selected tag
        const filtered = tag === 'all'
          ? seedPosts
          : seedPosts.filter((p) => p.tags.some((t) => t.name.toLowerCase() === tag.toLowerCase()));
        setPosts(filtered);
      }
    } catch {
      const filtered = tag === 'all'
        ? seedPosts
        : seedPosts.filter((p) => p.tags.some((t) => t.name.toLowerCase() === tag.toLowerCase()));
      setPosts(filtered);
    } finally {
      setLoading(false);
    }
  };

  const handleComposeClick = () => {
    if (!isAuthenticated) {
      openAuthModal('register');
      return;
    }
    if (!user?.quizVerified) {
      openQuizModal();
      return;
    }
    setIsComposeOpen(true);
  };

  const handlePostCreated = (newPost: Post) => {
    setPosts([newPost, ...posts]);
  };

  return (
    <div className="flex justify-center min-h-screen pb-20 md:pb-0">
      {/* Modals */}
      <AuthModal />
      <SoftGateQuizModal />
      <ProfileModal />
      <CreatePostModal
        isOpen={isComposeOpen}
        onClose={() => setIsComposeOpen(false)}
        onPostCreated={handlePostCreated}
      />

      {/* Main Container */}
      <main className="w-full max-w-2xl border-x border-stone-200 dark:border-bloom-darkBorder min-h-screen bg-bloom-bg dark:bg-bloom-dark">
        
        {/* Sticky Header */}
        <header className="sticky top-0 z-30 backdrop-blur-md bg-bloom-bg/90 dark:bg-bloom-dark/90 border-b border-stone-200 dark:border-bloom-darkBorder px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-bloom-terracotta flex items-center justify-center text-white font-bold text-sm shadow-sm">
              🌸
            </div>
            <div>
              <h1 className="font-semibold text-lg leading-tight tracking-tight text-bloom-wine dark:text-bloom-blush">Ease & Bloom</h1>
              <p className="text-xs text-bloom-muted">Women's Wellness Sanctuary</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAuthenticated && user ? (
              <button
                onClick={openProfileModal}
                className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-bloom-blush dark:bg-bloom-darkCard border border-stone-200 dark:border-stone-800 hover:border-bloom-terracotta transition-all"
              >
                <div className="w-6 h-6 rounded-full bg-bloom-terracotta text-white flex items-center justify-center text-xs font-bold">
                  {user.profile.displayName ? user.profile.displayName.charAt(0).toUpperCase() : '🌸'}
                </div>
                <span className="text-xs font-medium text-stone-800 dark:text-stone-200 max-w-[100px] truncate">
                  {user.profile.displayName}
                </span>
                {user.quizVerified && <CheckCircle2 className="w-3.5 h-3.5 text-bloom-sage" />}
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => openAuthModal('login')}
                  className="px-3 py-1.5 rounded-full text-xs font-semibold text-bloom-wine dark:text-bloom-blush hover:bg-bloom-blush dark:hover:bg-bloom-darkCard transition-colors"
                >
                  Sign In
                </button>
                <button
                  onClick={() => openAuthModal('register')}
                  className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-bloom-terracotta hover:bg-bloom-wine text-white shadow-sm transition-all"
                >
                  Join Sanctuary
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Soft-Gate Alert Banner (if unverified) */}
        {isAuthenticated && user && !user.quizVerified && (
          <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border-b border-amber-200 dark:border-amber-900 flex items-center justify-between text-xs text-amber-900 dark:text-amber-200">
            <div className="flex items-center gap-2">
              <span className="text-base">🌸</span>
              <span>Take the 1-minute welcome quiz to unlock full sanctuary posting!</span>
            </div>
            <button
              onClick={openQuizModal}
              className="px-3 py-1 rounded-full bg-amber-600 text-white font-semibold text-[11px] shadow-sm hover:bg-amber-700 transition-colors whitespace-nowrap ml-2"
            >
              Take Quiz
            </button>
          </div>
        )}

        {/* Topic Filter Pills */}
        <div className="flex items-center gap-2 px-4 py-3 overflow-x-auto no-scrollbar border-b border-stone-200/60 dark:border-bloom-darkBorder/60">
          {topics.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                activeTab === t.id
                  ? 'bg-bloom-wine text-white shadow-sm'
                  : 'bg-bloom-blush dark:bg-bloom-darkCard text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-800'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Quick Post Prompt Bar */}
        <div
          onClick={handleComposeClick}
          className="p-4 border-b border-stone-200/70 dark:border-bloom-darkBorder/70 flex items-center gap-3 cursor-pointer hover:bg-stone-50/50 dark:hover:bg-bloom-darkCard/30 transition-colors"
        >
          <div className="w-9 h-9 rounded-full bg-bloom-blush dark:bg-stone-800 flex items-center justify-center text-sm font-bold text-bloom-terracotta">
            🌸
          </div>
          <div className="flex-1 px-4 py-2.5 rounded-full bg-stone-100 dark:bg-stone-800/80 text-xs text-bloom-muted">
            Share what's on your heart, ask sisters, or create a poll...
          </div>
        </div>

        {/* Feed Posts */}
        <div>
          {loading ? (
            <div className="py-16 text-center text-xs text-bloom-muted">
              Loading sanctuary discussions...
            </div>
          ) : posts.length === 0 ? (
            <div className="py-16 text-center text-xs text-bloom-muted">
              No discussions yet in this topic. Be the first sister to share!
            </div>
          ) : (
            posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onPostUpdated={(updated) => {
                  setPosts(posts.map((p) => (p.id === updated.id ? updated : p)));
                }}
              />
            ))
          )}
        </div>
      </main>

      {/* Floating Compose Button */}
      <button
        onClick={handleComposeClick}
        className="fixed bottom-6 right-6 md:bottom-8 md:right-8 w-14 h-14 rounded-full bg-bloom-terracotta text-white flex items-center justify-center shadow-lg hover:bg-bloom-wine transition-all active:scale-95 z-40"
      >
        <Plus className="w-6 h-6" />
      </button>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-30 bg-bloom-bg/95 dark:bg-bloom-dark/95 backdrop-blur-md border-t border-stone-200 dark:border-bloom-darkBorder flex items-center justify-around py-2.5 md:hidden">
        <button className="flex flex-col items-center gap-0.5 text-bloom-wine dark:text-bloom-blush">
          <Compass className="w-5 h-5" />
          <span className="text-[10px] font-medium">Feed</span>
        </button>
        <button className="flex flex-col items-center gap-0.5 text-bloom-muted hover:text-bloom-wine dark:hover:text-bloom-blush transition-colors">
          <Shield className="w-5 h-5" />
          <span className="text-[10px] font-medium">Notes</span>
        </button>
        <button className="flex flex-col items-center gap-0.5 text-bloom-muted hover:text-bloom-wine dark:hover:text-bloom-blush transition-colors">
          <MessageCircle className="w-5 h-5" />
          <span className="text-[10px] font-medium">Messages</span>
        </button>
        <button
          onClick={isAuthenticated ? openProfileModal : () => openAuthModal('login')}
          className="flex flex-col items-center gap-0.5 text-bloom-muted hover:text-bloom-wine dark:hover:text-bloom-blush transition-colors"
        >
          <User className="w-5 h-5" />
          <span className="text-[10px] font-medium">{isAuthenticated ? 'Profile' : 'Sign In'}</span>
        </button>
      </nav>
    </div>
  );
}
