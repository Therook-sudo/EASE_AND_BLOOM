'use client';

import React, { useState } from 'react';
import { Heart, MessageCircle, Bookmark, Sparkles, Shield, Compass, Bell, User, Plus, Info } from 'lucide-react';

export default function HomeFeed() {
  const [activeTab, setActiveTab] = useState('all');

  const topics = [
    { id: 'all', label: 'All Sanctuary' },
    { id: 'mental-health', label: '#MentalHealth' },
    { id: 'pcos-fertility', label: '#PCOS & Fertility' },
    { id: 'wellness', label: '#SelfCare' },
    { id: 'motherhood', label: '#Motherhood' },
    { id: 'q-and-a', label: '#AskTheCommunity' },
  ];

  return (
    <div className="flex justify-center min-h-screen pb-20 md:pb-0">
      <main className="w-full max-w-2xl border-x border-stone-200 dark:border-bloom-darkBorder min-h-screen bg-bloom-bg dark:bg-bloom-dark">
        {/* Sticky Header */}
        <header className="sticky top-0 z-30 backdrop-blur-md bg-bloom-bg/90 dark:bg-bloom-dark/90 border-b border-stone-200 dark:border-bloom-darkBorder px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-bloom-terracotta flex items-center justify-center text-white font-bold text-sm shadow-sm">
              🌸
            </div>
            <div>
              <h1 className="font-semibold text-lg leading-tight tracking-tight text-bloom-wine dark:text-bloom-blush">Ease & Bloom</h1>
              <p className="text-xs text-bloom-muted">Your daily sanctuary</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="p-2 rounded-full hover:bg-bloom-blush dark:hover:bg-bloom-darkCard text-bloom-muted transition-colors">
              <Bell className="w-5 h-5" />
            </button>
          </div>
        </header>

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

        {/* Feed Posts */}
        <div className="divide-y divide-stone-200 dark:divide-bloom-darkBorder">
          {/* Post 1: Welcome post */}
          <article className="p-4 hover:bg-stone-50/50 dark:hover:bg-bloom-darkCard/30 transition-colors">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-bloom-blush dark:bg-stone-800 flex items-center justify-center text-lg flex-shrink-0">
                ✨
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="font-medium text-sm text-stone-900 dark:text-stone-100">Ease & Bloom Sanctuary</span>
                    <span className="text-xs text-bloom-muted">@sanctuary · 1h</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-bloom-sage/20 text-bloom-wine dark:text-bloom-sage">Welcome</span>
                </div>

                <p className="mt-2 text-sm text-stone-800 dark:text-stone-200 leading-relaxed">
                  Welcome to our new home! A gentle, private space to express your wellness journey, share advice, and lift each other up without the noise. 🌸
                </p>

                {/* Community Notes Callout */}
                <div className="mt-3 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-800/40 text-xs">
                  <div className="flex items-center gap-1.5 text-amber-900 dark:text-amber-300 font-semibold mb-1">
                    <Info className="w-3.5 h-3.5" /> Community Context
                  </div>
                  <p className="text-amber-800 dark:text-amber-200/90 leading-normal">
                    Readers added context: Ease & Bloom is a verified women-only community with 24/7 compassionate moderation.
                  </p>
                </div>

                {/* Post Actions */}
                <div className="flex items-center justify-between mt-3 text-bloom-muted text-xs max-w-sm">
                  <button className="flex items-center gap-1 hover:text-rose-500 transition-colors">
                    <Heart className="w-4 h-4" /> <span>24</span>
                  </button>
                  <button className="flex items-center gap-1 hover:text-bloom-terracotta transition-colors">
                    <Sparkles className="w-4 h-4" /> <span>12 Hugs</span>
                  </button>
                  <button className="flex items-center gap-1 hover:text-bloom-wine transition-colors">
                    <MessageCircle className="w-4 h-4" /> <span>8</span>
                  </button>
                  <button className="hover:text-stone-900 dark:hover:text-white transition-colors">
                    <Bookmark className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </article>

          {/* Post 2: Anonymous Question */}
          <article className="p-4 hover:bg-stone-50/50 dark:hover:bg-bloom-darkCard/30 transition-colors">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-stone-200 dark:bg-stone-800 flex items-center justify-center text-sm font-semibold text-bloom-muted flex-shrink-0">
                🎭
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="font-medium text-sm text-stone-900 dark:text-stone-100">Anonymous Sister</span>
                    <span className="text-xs text-bloom-muted">· 3h</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-purple-100 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300">Anonymous</span>
                </div>

                <p className="mt-2 text-sm text-stone-800 dark:text-stone-200 leading-relaxed">
                  Has anyone here tried natural cycle tracking for PCOS? Looking for practical tips on managing mood fluctuations during ovulation. #PCOS #MoodCare
                </p>

                <div className="flex items-center justify-between mt-3 text-bloom-muted text-xs max-w-sm">
                  <button className="flex items-center gap-1 hover:text-rose-500 transition-colors">
                    <Heart className="w-4 h-4" /> <span>18</span>
                  </button>
                  <button className="flex items-center gap-1 hover:text-bloom-terracotta transition-colors">
                    <Sparkles className="w-4 h-4" /> <span>15 Hugs</span>
                  </button>
                  <button className="flex items-center gap-1 hover:text-bloom-wine transition-colors">
                    <MessageCircle className="w-4 h-4" /> <span>14</span>
                  </button>
                  <button className="hover:text-stone-900 dark:hover:text-white transition-colors">
                    <Bookmark className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </article>
        </div>
      </main>

      {/* Floating Compose Button */}
      <button className="fixed bottom-6 right-6 md:bottom-8 md:right-8 w-14 h-14 rounded-full bg-bloom-terracotta text-white flex items-center justify-center shadow-lg hover:bg-bloom-wine transition-all active:scale-95 z-40">
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
        <button className="flex flex-col items-center gap-0.5 text-bloom-muted hover:text-bloom-wine dark:hover:text-bloom-blush transition-colors">
          <User className="w-5 h-5" />
          <span className="text-[10px] font-medium">Profile</span>
        </button>
      </nav>
    </div>
  );
}
