'use client';

import React, { useState, useEffect } from 'react';
import { X, Heart, Phone, Shield, Sparkles, Wind } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function CrisisHelplineModal({ isOpen, onClose }: Props) {
  const [breathState, setBreathState] = useState<'Inhale' | 'Hold' | 'Exhale'>('Inhale');

  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      setBreathState((prev) => {
        if (prev === 'Inhale') return 'Hold';
        if (prev === 'Hold') return 'Exhale';
        return 'Inhale';
      });
    }, 4000);
    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg p-6 md:p-8 bg-bloom-bg dark:bg-bloom-dark rounded-3xl shadow-2xl border border-stone-200 dark:border-bloom-darkBorder max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-bloom-muted hover:bg-bloom-blush dark:hover:bg-bloom-darkCard transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 mx-auto rounded-full bg-rose-100 dark:bg-rose-950/40 text-rose-600 dark:text-rose-300 flex items-center justify-center text-xl shadow-sm mb-2">
            🌸
          </div>
          <h2 className="text-xl font-bold text-stone-900 dark:text-stone-100">You Are Not Alone</h2>
          <p className="text-xs text-bloom-muted mt-1 max-w-sm mx-auto">
            Ease & Bloom is a supportive sisterhood. If you are experiencing acute distress, free confidential human support is available 24/7.
          </p>
        </div>

        {/* Grounding Breath Widget */}
        <div className="p-4 mb-5 rounded-2xl bg-bloom-blush dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 text-center">
          <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-bloom-wine dark:text-bloom-blush mb-2">
            <Wind className="w-3.5 h-3.5" /> Gentle Grounding Box Breathing
          </div>
          <div className="w-20 h-20 mx-auto rounded-full border-4 border-bloom-terracotta/40 flex items-center justify-center my-2 transition-all duration-1000 scale-105">
            <span className="text-xs font-bold text-bloom-wine dark:text-bloom-blush">{breathState}</span>
          </div>
          <p className="text-[11px] text-bloom-muted">Inhale 4s · Hold 4s · Exhale 4s</p>
        </div>

        {/* Verified Crisis Hotlines */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-bloom-muted">24/7 Confidential Hotlines</h3>

          <div className="p-3 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 flex items-center justify-between">
            <div>
              <h4 className="text-xs font-bold text-stone-900 dark:text-stone-100">National Suicide & Crisis Lifeline</h4>
              <p className="text-[11px] text-bloom-muted">US & Canada · Free, confidential 24/7</p>
            </div>
            <a
              href="tel:988"
              className="px-3 py-1.5 rounded-lg bg-bloom-terracotta text-white text-xs font-semibold hover:bg-bloom-wine transition-colors flex items-center gap-1"
            >
              <Phone className="w-3 h-3" /> Call 988
            </a>
          </div>

          <div className="p-3 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 flex items-center justify-between">
            <div>
              <h4 className="text-xs font-bold text-stone-900 dark:text-stone-100">Samaritans UK & Ireland</h4>
              <p className="text-[11px] text-bloom-muted">UK · Free from any phone, 24/7</p>
            </div>
            <a
              href="tel:116123"
              className="px-3 py-1.5 rounded-lg bg-bloom-terracotta text-white text-xs font-semibold hover:bg-bloom-wine transition-colors flex items-center gap-1"
            >
              <Phone className="w-3 h-3" /> Call 116 123
            </a>
          </div>

          <div className="p-3 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 flex items-center justify-between">
            <div>
              <h4 className="text-xs font-bold text-stone-900 dark:text-stone-100">Crisis Text Line (Worldwide)</h4>
              <p className="text-[11px] text-bloom-muted">Text with a trained crisis counselor</p>
            </div>
            <a
              href="sms:741741"
              className="px-3 py-1.5 rounded-lg bg-stone-800 dark:bg-stone-700 text-white text-xs font-semibold hover:bg-stone-900 transition-colors"
            >
              Text HOME to 741741
            </a>
          </div>

          <div className="p-3 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 flex items-center justify-between">
            <div>
              <h4 className="text-xs font-bold text-stone-900 dark:text-stone-100">Postpartum Support International</h4>
              <p className="text-[11px] text-bloom-muted">Support for mothers & postpartum depression</p>
            </div>
            <a
              href="tel:18009444773"
              className="px-3 py-1.5 rounded-lg bg-bloom-sage text-white text-xs font-semibold hover:bg-emerald-700 transition-colors"
            >
              Call Helpline
            </a>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-stone-200 dark:border-stone-800 text-center">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-stone-200 dark:bg-stone-800 hover:bg-stone-300 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 text-xs font-semibold transition-colors"
          >
            Return to Sanctuary Feed
          </button>
        </div>
      </div>
    </div>
  );
}
