'use client';

import React, { useState } from 'react';
import { X, User, Bell, Shield, Moon, LogOut, Check } from 'lucide-react';
import { useAuthStore } from '../../lib/auth-store';
import { apiRequest } from '../../lib/api';

export default function ProfileModal() {
  const { user, isProfileModalOpen, closeProfileModal, updateProfile, logout } = useAuthStore();

  const [displayName, setDisplayName] = useState(user?.profile?.displayName || '');
  const [bio, setBio] = useState(user?.profile?.bio || '');
  const [dmPrivacy, setDmPrivacy] = useState(user?.profile?.dmPrivacy || 'MUTUAL_FOLLOWS');
  const [quietHoursStart, setQuietHoursStart] = useState(user?.profile?.quietHoursStart || '22:00');
  const [quietHoursEnd, setQuietHoursEnd] = useState(user?.profile?.quietHoursEnd || '08:00');
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  React.useEffect(() => {
    if (user) {
      setDisplayName(user.profile.displayName);
      setBio(user.profile.bio || '');
      setDmPrivacy(user.profile.dmPrivacy || 'MUTUAL_FOLLOWS');
      setQuietHoursStart(user.profile.quietHoursStart || '22:00');
      setQuietHoursEnd(user.profile.quietHoursEnd || '08:00');
    }
  }, [user, isProfileModalOpen]);

  if (!isProfileModalOpen || !user) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSavedSuccess(false);

    try {
      await apiRequest('/users/profile/me', {
        method: 'PATCH',
        body: JSON.stringify({
          displayName,
          bio,
          dmPrivacy,
          quietHoursStart,
          quietHoursEnd,
        }),
      });

      updateProfile({
        displayName,
        bio,
        dmPrivacy: dmPrivacy as any,
        quietHoursStart,
        quietHoursEnd,
      });

      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2000);
    } catch (err: any) {
      alert(err.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md p-6 bg-bloom-bg dark:bg-bloom-dark rounded-3xl shadow-2xl border border-stone-200 dark:border-bloom-darkBorder max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={closeProfileModal}
          className="absolute top-4 right-4 p-2 rounded-full text-bloom-muted hover:bg-bloom-blush dark:hover:bg-bloom-darkCard transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Profile Card Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-14 h-14 rounded-full bg-bloom-blush dark:bg-stone-800 border-2 border-bloom-terracotta flex items-center justify-center text-xl font-bold text-bloom-wine dark:text-bloom-blush">
            {displayName ? displayName.charAt(0).toUpperCase() : '🌸'}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="text-base font-bold text-stone-900 dark:text-stone-100">{displayName}</h2>
              {user.quizVerified && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-bloom-sage/20 text-bloom-wine dark:text-bloom-sage font-semibold">
                  Verified Sister
                </span>
              )}
            </div>
            <p className="text-xs text-bloom-muted">@{user.profile.username}</p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          {/* Display Name */}
          <div>
            <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1">
              Display Name
            </label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 focus:outline-none focus:ring-2 focus:ring-bloom-terracotta"
            />
          </div>

          {/* Bio */}
          <div>
            <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1">
              Bio / Wellness Focus
            </label>
            <textarea
              rows={2}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Share a little about your journey (PCOS, mental wellness, motherhood, self-care)..."
              className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 focus:outline-none focus:ring-2 focus:ring-bloom-terracotta resize-none"
            />
          </div>

          {/* DM Privacy Settings */}
          <div className="pt-2 border-t border-stone-200 dark:border-bloom-darkBorder">
            <label className="block text-xs font-semibold text-stone-900 dark:text-stone-100 mb-1 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-bloom-terracotta" /> Private Messaging (DMs)
            </label>
            <p className="text-[11px] text-bloom-muted mb-2">Who is allowed to send you private 1-on-1 messages?</p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setDmPrivacy('MUTUAL_FOLLOWS')}
                className={`p-2.5 rounded-xl text-xs text-left border transition-all ${
                  dmPrivacy === 'MUTUAL_FOLLOWS'
                    ? 'bg-bloom-wine text-white border-bloom-wine shadow-sm font-semibold'
                    : 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 text-bloom-muted'
                }`}
              >
                Mutual Follows Only (Recommended)
              </button>
              <button
                type="button"
                onClick={() => setDmPrivacy('EVERYONE')}
                className={`p-2.5 rounded-xl text-xs text-left border transition-all ${
                  dmPrivacy === 'EVERYONE'
                    ? 'bg-bloom-wine text-white border-bloom-wine shadow-sm font-semibold'
                    : 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 text-bloom-muted'
                }`}
              >
                All Community Members
              </button>
            </div>
          </div>

          {/* Quiet Hours (Anti-Overload) */}
          <div className="pt-2 border-t border-stone-200 dark:border-bloom-darkBorder">
            <label className="block text-xs font-semibold text-stone-900 dark:text-stone-100 mb-1 flex items-center gap-1.5">
              <Moon className="w-3.5 h-3.5 text-indigo-400" /> Quiet Hours (No Non-Urgent Pings)
            </label>
            <p className="text-[11px] text-bloom-muted mb-2">Notifications during these hours are quietly held until morning.</p>
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <span className="text-[10px] text-bloom-muted block mb-1">Silence Starts</span>
                <input
                  type="time"
                  value={quietHoursStart}
                  onChange={(e) => setQuietHoursStart(e.target.value)}
                  className="w-full px-2 py-1.5 text-xs rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800"
                />
              </div>
              <span className="text-bloom-muted text-xs mt-4">to</span>
              <div className="flex-1">
                <span className="text-[10px] text-bloom-muted block mb-1">Silence Ends</span>
                <input
                  type="time"
                  value={quietHoursEnd}
                  onChange={(e) => setQuietHoursEnd(e.target.value)}
                  className="w-full px-2 py-1.5 text-xs rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800"
                />
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="pt-4 flex items-center justify-between">
            <button
              type="button"
              onClick={logout}
              className="text-xs text-rose-500 hover:text-rose-700 flex items-center gap-1"
            >
              <LogOut className="w-3.5 h-3.5" /> Sign Out
            </button>

            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 rounded-xl bg-bloom-terracotta hover:bg-bloom-wine text-white text-xs font-semibold shadow-sm transition-all flex items-center gap-1.5 disabled:opacity-50"
            >
              {saving ? 'Saving...' : savedSuccess ? (
                <>
                  <Check className="w-3.5 h-3.5" /> Saved!
                </>
              ) : (
                'Save Preferences'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
