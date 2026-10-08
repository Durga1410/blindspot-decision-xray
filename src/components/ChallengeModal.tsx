import React from 'react';
import { ShieldAlert, X, AlertTriangle, ArrowRight, Flame, HelpCircle, Eye, Search, FileQuestion } from 'lucide-react';
import { ChallengeReport } from '../types/xray';
import { EvidenceBadge } from './EvidenceBadge';

interface ChallengeModalProps {
  isOpen: boolean;
  onClose: () => void;
  isLoading: boolean;
  challengeData: ChallengeReport | null;
  onRetry: () => void;
}

export const ChallengeModal: React.FC<ChallengeModalProps> = ({
  isOpen,
  onClose,
  isLoading,
  challengeData,
  onRetry,
}) => {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="challenge-dialog-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-slate-950/85 backdrop-blur-md"
    >
      <div className="relative w-full max-w-3xl rounded-2xl border border-rose-900/60 bg-gradient-to-b from-slate-950 via-[#0d0d16] to-slate-950 p-6 sm:p-8 shadow-[0_0_60px_rgba(244,63,94,0.18)] max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close adversarial challenge"
          className="absolute top-5 right-5 p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-start gap-3.5 mb-6 pb-4 border-b border-rose-900/40">
          <div className="w-10 h-10 rounded-xl bg-rose-950/60 border border-rose-700/60 flex items-center justify-center text-rose-400 shrink-0 shadow-inner">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono uppercase tracking-widest text-rose-400 font-semibold">
                Adversarial Reasoning Review
              </span>
              <span className="text-slate-600">·</span>
              <span className="text-[11px] font-mono text-slate-400">
                Stress-Testing Logic
              </span>
            </div>
            <h2 id="challenge-dialog-title" className="text-xl sm:text-2xl font-bold text-white font-mono mt-0.5">
              CHALLENGE MY REASONING
            </h2>
          </div>
        </div>

        {isLoading ? (
          <div className="py-16 text-center space-y-4">
            <div className="relative mx-auto w-12 h-12 flex items-center justify-center">
              <div className="w-12 h-12 rounded-full border-2 border-rose-500/20 border-t-rose-500 animate-spin" />
            </div>
            <p className="text-sm font-mono text-rose-300">
              Examining load-bearing assumptions & empirical evidence gaps...
            </p>
            <p className="text-xs text-slate-500 max-w-md mx-auto font-sans">
              Conducting second-level adversarial review with strict non-judgmental rigor.
            </p>
          </div>
        ) : challengeData ? (
          <div className="space-y-6">
            {/* Banner: What this mode is */}
            <div className="p-3.5 rounded-lg border border-rose-900/40 bg-rose-950/20 text-xs text-rose-200/90 leading-relaxed flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>
                <strong>Adversarial Reviewer:</strong> This analysis intentionally stress-tests your reasoning and isolates your most consequential vulnerabilities. It does not decide for you or rank choices.
              </span>
            </div>

            {/* 1. Strongest Assumption */}
            <div className="p-5 rounded-xl border border-rose-900/50 bg-slate-900/60 space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-mono uppercase tracking-wider text-rose-400 font-bold">
                  1. Strongest Assumption
                </span>
                <EvidenceBadge level={challengeData.strongest_assumption_level || 'INFERRED'} />
              </div>
              <p className="text-sm sm:text-base font-semibold text-white leading-relaxed">
                "{challengeData.strongest_assumption}"
              </p>
            </div>

            {/* 2. Evidence Supporting It */}
            <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/40 space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-400 font-bold">
                  2. Evidence Supporting It (From User Input)
                </span>
                <EvidenceBadge level="USER-STATED" />
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                {challengeData.evidence_supporting_it}
              </p>
            </div>

            {/* 3. Evidence Missing */}
            <div className="p-5 rounded-xl border border-amber-900/40 bg-amber-950/15 space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-mono uppercase tracking-wider text-amber-400 font-bold">
                  3. Crucial Missing Evidence
                </span>
                <EvidenceBadge level="HYPOTHESIS TO VERIFY" />
              </div>
              <p className="text-xs sm:text-sm text-amber-100 leading-relaxed font-sans">
                {challengeData.evidence_missing}
              </p>
            </div>

            {/* 4. What Could Make It Wrong */}
            <div className="p-5 rounded-xl border border-rose-900/40 bg-rose-950/20 space-y-2">
              <span className="text-[11px] font-mono uppercase tracking-wider text-rose-300 font-bold block">
                4. What Could Make It Wrong?
              </span>
              <p className="text-xs sm:text-sm text-rose-100 leading-relaxed font-sans">
                {challengeData.what_could_make_it_wrong}
              </p>
            </div>

            {/* 5. Counter-Perspective */}
            <div className="p-5 rounded-xl border border-purple-900/40 bg-purple-950/20 space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-mono uppercase tracking-wider text-purple-300 font-bold">
                  5. Counter-Perspective
                </span>
                <EvidenceBadge level={challengeData.counter_perspective_level || 'HYPOTHESIS TO VERIFY'} />
              </div>
              <p className="text-xs sm:text-sm text-purple-100 leading-relaxed font-sans">
                {challengeData.counter_perspective}
              </p>
            </div>

            {/* 6. Three Questions to Investigate */}
            <div className="space-y-3">
              <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-bold block">
                6. Three Questions You Should Investigate
              </span>
              <div className="space-y-2">
                {challengeData.questions_to_investigate.map((q, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-lg border border-slate-800 bg-slate-900/40 flex items-start gap-3"
                  >
                    <span className="text-xs font-mono font-bold text-rose-400 bg-rose-950/80 border border-rose-900/40 w-5 h-5 rounded flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                      {q}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Disclaimer */}
            <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
              <p className="text-[11px] text-slate-400 font-sans italic">
                BlindSpot does not decide for you. It helps you examine what may be missing.
              </p>
              <button
                onClick={onClose}
                className="w-full sm:w-auto px-5 py-2 text-xs font-mono font-bold text-slate-900 bg-white hover:bg-slate-200 rounded-lg transition-colors"
              >
                Return to Report
              </button>
            </div>
          </div>
        ) : (
          <div className="py-12 text-center space-y-4">
            <p className="text-sm text-slate-300">
              Unable to complete adversarial review.
            </p>
            <button
              onClick={onRetry}
              className="px-4 py-2 text-xs font-mono bg-rose-600 hover:bg-rose-500 text-white rounded-lg transition-colors"
            >
              Retry Challenge
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
