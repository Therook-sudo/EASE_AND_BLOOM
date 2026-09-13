'use client';

import React, { useState } from 'react';
import { X, Heart, Shield, Lock, Mail, User, Sparkles } from 'lucide-react';
import { useAuthStore } from '../../lib/auth-store';
import { apiRequest } from '../../lib/api';

export default function AuthModal() {
  const { isAuthModalOpen, closeAuthModal, authModalTab, openAuthModal, setAuth } = useAuthStore();
  
  const [tab, setTab] = useState<'login' | 'register'>(authModalTab);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Sync tab with store state when opened
  React.useEffect(() => {
    setTab(authModalTab);
    setError(null);
  }, [authModalTab, isAuthModalOpen]);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (tab === 'register') {
        const res = await apiRequest<{ user: any; token: string }>('/auth/register', {
          method: 'POST',
          body: JSON.stringify({ email, password, displayName, username }),
        });
        setAuth(res.user, res.token);
      } else {
        const res = await apiRequest<{ user: any; token: string }>('/auth/login', {
          method: 'POST',
          body: JSON.stringify({ email, password }),
        });
        setAuth(res.user, res.token);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to authenticate. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md p-6 bg-bloom-bg dark:bg-bloom-dark rounded-3xl shadow-2xl border border-stone-200 dark:border-bloom-darkBorder">
        
        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          className="absolute top-4 right-4 p-2 rounded-full text-bloom-muted hover:bg-bloom-blush dark:hover:bg-bloom-darkCard transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Branding */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 mx-auto rounded-full bg-bloom-terracotta flex items-center justify-center text-2xl shadow-md mb-2">
            🌸
          </div>
          <h2 className="text-xl font-bold text-bloom-wine dark:text-bloom-blush tracking-tight">
            {tab === 'register' ? 'Join Ease & Bloom' : 'Welcome Back'}
          </h2>
          <p className="text-xs text-bloom-muted mt-1">
            {tab === 'register'
              ? 'A safe, women-only sanctuary for mental & physical wellness.'
              : 'Sign in to access your peaceful sanctuary feed and discussions.'}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex rounded-full bg-bloom-blush dark:bg-bloom-darkCard p-1 mb-5">
          <button
            type="button"
            onClick={() => { setTab('register'); setError(null); }}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-full transition-all ${
              tab === 'register'
                ? 'bg-white dark:bg-stone-800 text-bloom-wine dark:text-bloom-blush shadow-sm'
                : 'text-bloom-muted hover:text-stone-900'
            }`}
          >
            Create Account
          </button>
          <button
            type="button"
            onClick={() => { setTab('login'); setError(null); }}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-full transition-all ${
              tab === 'login'
                ? 'bg-white dark:bg-stone-800 text-bloom-wine dark:text-bloom-blush shadow-sm'
                : 'text-bloom-muted hover:text-stone-900'
            }`}
          >
            Sign In
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3 mb-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-xs text-rose-700 dark:text-rose-300">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          {tab === 'register' && (
            <>
              <div>
                <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1">
                  Display Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-bloom-muted absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sarah Johnson"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 focus:outline-none focus:ring-2 focus:ring-bloom-terracotta"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1">
                  Username Handle
                </label>
                <div className="relative">
                  <span className="text-bloom-muted text-xs absolute left-3 top-2.5">@</span>
                  <input
                    type="text"
                    required
                    placeholder="sarah_j"
                    value={username}
                    onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                    className="w-full pl-7 pr-3 py-2 text-xs rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 focus:outline-none focus:ring-2 focus:ring-bloom-terracotta"
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-bloom-muted absolute left-3 top-2.5" />
              <input
                type="email"
                required
                placeholder="sister@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 focus:outline-none focus:ring-2 focus:ring-bloom-terracotta"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-bloom-muted absolute left-3 top-2.5" />
              <input
                type="password"
                required
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 focus:outline-none focus:ring-2 focus:ring-bloom-terracotta"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 py-2.5 rounded-xl bg-bloom-terracotta hover:bg-bloom-wine text-white text-xs font-semibold shadow-md transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-1.5"
          >
            {loading ? (
              <span>Connecting to sanctuary...</span>
            ) : tab === 'register' ? (
              <>
                <Sparkles className="w-3.5 h-3.5" /> Continue to Verification Quiz
              </>
            ) : (
              'Sign In to Sanctuary'
            )}
          </button>
        </form>

        {/* Footer info */}
        <div className="mt-5 text-center text-[11px] text-bloom-muted flex items-center justify-center gap-1">
          <Shield className="w-3 h-3 text-bloom-sage" />
          <span>Private, encrypted sanctuary for women.</span>
        </div>
      </div>
    </div>
  );
}
