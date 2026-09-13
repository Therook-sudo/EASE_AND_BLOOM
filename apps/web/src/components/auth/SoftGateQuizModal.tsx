'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles, Heart, CheckCircle2, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAuthStore } from '../../lib/auth-store';
import { apiRequest } from '../../lib/api';

interface QuizScenario {
  id: number;
  category: string;
  scenario: string;
  options: { id: string; text: string }[];
}

export default function SoftGateQuizModal() {
  const { isQuizModalOpen, closeQuizModal, setQuizVerified } = useAuthStore();

  const [questions, setQuestions] = useState<QuizScenario[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    if (isQuizModalOpen) {
      loadQuestions();
    }
  }, [isQuizModalOpen]);

  const loadQuestions = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiRequest<QuizScenario[]>('/auth/quiz-questions');
      setQuestions(data);
      setCurrentStep(0);
      setSelectedAnswers([]);
      setIsCompleted(false);
    } catch {
      // Fallback default client questions if backend is offline
      setQuestions([
        {
          id: 1,
          category: 'Sisterhood Solidarity',
          scenario: "A sister in the sanctuary community texts: 'I\'m caught out without sanitary pads and my cycle started out of nowhere.' What is your natural instinct?",
          options: [
            { id: 'a', text: "Check my bag/stash for a spare, or share a fast delivery recommendation." },
            { id: 'b', text: "Tell her she should have planned better and change the topic." },
          ],
        },
        {
          id: 2,
          category: 'Emotional Empathy',
          scenario: "A close girlfriend cancels dinner last minute saying: 'My cramps are terrible, I\'m bloated, and feeling completely drained.' What is your response?",
          options: [
            { id: 'a', text: "'Take all the time you need babe! Heat pad, soft blanket, and zero guilt.'" },
            { id: 'b', text: "'You are being dramatic, just take a pill and come out.'" },
          ],
        },
        {
          id: 3,
          category: 'Universal Care Protocol',
          scenario: "You notice another woman in a shared space discreetly looking anxious and gesturing toward the back of her light trousers. What is the sisterhood protocol?",
          options: [
            { id: 'a', text: "Discreetly step in, let her know quietly, and offer a jacket or cardigan to tie around her waist." },
            { id: 'b', text: "Pretend not to notice and quickly walk past." },
          ],
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (!isQuizModalOpen) return null;

  const currentQ = questions[currentStep];

  const handleSelectOption = (optionId: string) => {
    const updated = [...selectedAnswers];
    updated[currentStep] = optionId;
    setSelectedAnswers(updated);
    setError(null);

    // If not the last question, automatically glide to next after a micro-pause
    if (currentStep < questions.length - 1) {
      setTimeout(() => {
        setCurrentStep((prev) => prev + 1);
      }, 250);
    }
  };

  const handleFinalSubmit = async () => {
    if (selectedAnswers.length !== questions.length) {
      setError('Please answer all 3 scenarios.');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      await apiRequest('/auth/verify-quiz', {
        method: 'POST',
        body: JSON.stringify({ answers: selectedAnswers }),
      });
      setIsCompleted(true);
      setTimeout(() => {
        setQuizVerified(true);
      }, 1600);
    } catch (err: any) {
      setError(err.message || 'Answers did not match our community care ethos. Please review and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg p-6 md:p-8 bg-bloom-bg dark:bg-bloom-dark rounded-3xl shadow-2xl border border-stone-200 dark:border-bloom-darkBorder">
        
        {isCompleted ? (
          /* Celebration State */
          <div className="text-center py-6 animate-in zoom-in-95 duration-300">
            <div className="w-16 h-16 mx-auto rounded-full bg-bloom-sage/20 text-bloom-wine dark:text-bloom-sage flex items-center justify-center text-3xl shadow-sm mb-3">
              🌸
            </div>
            <h3 className="text-xl font-bold text-bloom-wine dark:text-bloom-blush">
              Welcome Home, Sister!
            </h3>
            <p className="text-xs text-bloom-muted mt-2 max-w-xs mx-auto">
              Your soft-gate verification is complete. You now have full sanctuary access to post, discuss, and support others.
            </p>
            <div className="mt-6 flex items-center justify-center gap-1.5 text-xs text-bloom-sage font-medium">
              <CheckCircle2 className="w-4 h-4" /> Unlocking your sanctuary feed...
            </div>
          </div>
        ) : (
          /* Quiz Steps */
          <>
            {/* Header / Progress */}
            <div className="mb-6">
              <div className="flex items-center justify-between text-xs text-bloom-muted mb-2">
                <span className="font-semibold text-bloom-terracotta uppercase tracking-wider text-[10px]">
                  Sisterhood Gatekeeper
                </span>
                <span>Question {currentStep + 1} of {questions.length || 3}</span>
              </div>
              <div className="w-full bg-stone-200 dark:bg-stone-800 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-bloom-terracotta h-full transition-all duration-300 rounded-full"
                  style={{ width: `${((currentStep + 1) / (questions.length || 3)) * 100}%` }}
                />
              </div>
            </div>

            {loading ? (
              <div className="py-12 text-center text-xs text-bloom-muted">
                Loading gentle scenarios...
              </div>
            ) : currentQ ? (
              <div>
                <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-bloom-blush dark:bg-bloom-darkCard text-bloom-wine dark:text-bloom-blush mb-2">
                  {currentQ.category}
                </span>

                <h3 className="text-sm md:text-base font-semibold text-stone-900 dark:text-stone-100 leading-relaxed mb-5">
                  {currentQ.scenario}
                </h3>

                {/* Options */}
                <div className="space-y-2.5">
                  {currentQ.options.map((opt) => {
                    const isSelected = selectedAnswers[currentStep] === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => handleSelectOption(opt.id)}
                        className={`w-full text-left p-3.5 rounded-2xl text-xs leading-relaxed border transition-all ${
                          isSelected
                            ? 'bg-bloom-wine text-white border-bloom-wine shadow-sm scale-[1.01]'
                            : 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 text-stone-800 dark:text-stone-200 hover:border-bloom-terracotta hover:bg-stone-50/80 dark:hover:bg-stone-800/60'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span>{opt.text}</span>
                          {isSelected && <CheckCircle2 className="w-4 h-4 text-white flex-shrink-0 ml-2" />}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {error && (
                  <div className="mt-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 text-xs text-rose-700 dark:text-rose-300 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                {/* Footer Navigation */}
                <div className="flex items-center justify-between mt-6 pt-4 border-t border-stone-200/60 dark:border-stone-800/60">
                  <button
                    type="button"
                    disabled={currentStep === 0}
                    onClick={() => setCurrentStep((prev) => Math.max(0, prev - 1))}
                    className="text-xs text-bloom-muted hover:text-stone-900 dark:hover:text-white disabled:opacity-30"
                  >
                    Previous
                  </button>

                  {currentStep < questions.length - 1 ? (
                    <button
                      type="button"
                      disabled={!selectedAnswers[currentStep]}
                      onClick={() => setCurrentStep((prev) => prev + 1)}
                      className="px-4 py-2 rounded-xl bg-bloom-terracotta text-white text-xs font-semibold hover:bg-bloom-wine disabled:opacity-40 transition-all flex items-center gap-1"
                    >
                      Next Scenario <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      disabled={submitting || !selectedAnswers[currentStep]}
                      onClick={handleFinalSubmit}
                      className="px-5 py-2 rounded-xl bg-bloom-terracotta text-white text-xs font-semibold hover:bg-bloom-wine disabled:opacity-40 shadow-sm transition-all flex items-center gap-1.5"
                    >
                      {submitting ? 'Verifying...' : 'Complete & Enter Sanctuary'}
                      <Sparkles className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ) : null}
          </>
        )}
      </div>
    </div>
  );
}
