import React from 'react';
import { ArrowRight, ShieldCheck, Scale, Sparkles, AlertCircle, Compass } from 'lucide-react';
import { XRayVisual } from './XRayVisual';
import { SAMPLE_SCENARIOS, SampleScenario } from '../data/sampleScenarios';

interface LandingHeroProps {
  onStart: () => void;
  onSelectSample: (scenario: SampleScenario) => void;
}

export const LandingHero: React.FC<LandingHeroProps> = ({ onStart, onSelectSample }) => {
  return (
    <div className="relative overflow-hidden py-12 sm:py-20 lg:py-24">
      {/* Background radial glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-96 bg-radial-gradient pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Main Hero Header */}
        <div className="text-center max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/40 border border-cyan-800/40 text-cyan-300 text-xs font-mono tracking-widest uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
            Decision X-Ray System
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white font-mono leading-none">
            BLINDSPOT
          </h1>

          <div className="space-y-3">
            <p className="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-100 font-sans">
              "Don't ask AI what to decide.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400">
                Ask AI what you're failing to see.
              </span>"
            </p>
            <p className="text-base sm:text-lg text-slate-400 leading-relaxed font-sans max-w-2xl mx-auto">
              BlindSpot stress-tests your reasoning by uncovering hidden assumptions, overlooked factors, reasoning tensions and questions worth exploring.
            </p>
          </div>

          {/* Primary CTA Area */}
          <div className="pt-2 flex flex-col items-center gap-3">
            <button
              onClick={onStart}
              className="group inline-flex items-center gap-3 px-8 py-4 text-base font-semibold text-slate-950 bg-gradient-to-r from-cyan-400 to-sky-300 hover:from-cyan-300 hover:to-sky-200 rounded-xl shadow-[0_0_25px_rgba(56,189,248,0.35)] transition-all hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 font-mono tracking-wide"
            >
              <span>X-Ray My Decision</span>
              <ArrowRight className="w-4 h-4 text-slate-950 group-hover:translate-x-1 transition-transform" />
            </button>
            <p className="text-xs sm:text-sm text-slate-400 font-sans">
              Your decision stays yours. We help you examine it more deeply.
            </p>
          </div>
        </div>

        {/* Subtle Animated X-Ray Scanning Visual */}
        <div className="mt-14 sm:mt-16">
          <XRayVisual />
        </div>

        {/* The 4 Principles of Non-Deciding AI */}
        <div className="mt-20 border-t border-slate-800/80 pt-14">
          <div className="text-center max-w-xl mx-auto mb-10">
            <h2 className="text-xs font-mono uppercase tracking-widest text-cyan-400 mb-2">
              The Cognitive Architecture
            </h2>
            <h3 className="text-xl sm:text-2xl font-bold text-white">
              Why We Never Tell You What to Choose
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded-xl border border-slate-800/80 bg-slate-900/40 backdrop-blur-sm">
              <div className="w-9 h-9 rounded-lg bg-cyan-950/50 border border-cyan-800/50 flex items-center justify-center text-cyan-400 mb-4">
                <Scale className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-semibold text-white mb-2">
                1. Decision Sovereignty
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Generic AI tries to tell you what choice is "best." BlindSpot strictly refuses to choose for you or output probabilities. You retain 100% agency.
              </p>
            </div>

            <div className="p-5 rounded-xl border border-slate-800/80 bg-slate-900/40 backdrop-blur-sm">
              <div className="w-9 h-9 rounded-lg bg-indigo-950/50 border border-indigo-800/50 flex items-center justify-center text-indigo-400 mb-4">
                <AlertCircle className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-semibold text-white mb-2">
                2. Inversion & Stress-Testing
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Most confirmation bias happens in the premises. We illuminate what conditions would have to occur for your core assumptions to be wrong.
              </p>
            </div>

            <div className="p-5 rounded-xl border border-slate-800/80 bg-slate-900/40 backdrop-blur-sm">
              <div className="w-9 h-9 rounded-lg bg-sky-950/50 border border-sky-800/50 flex items-center justify-center text-sky-400 mb-4">
                <Compass className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-semibold text-white mb-2">
                3. Reasoning Tension Audit
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                We detect discrepancies between what you say matters (e.g. family, stability) and how your actual logic is structured.
              </p>
            </div>
          </div>
        </div>

        {/* 1-Click Fast Presets for Quick Testing */}
        <div className="mt-16 p-6 rounded-xl border border-slate-800 bg-slate-900/30">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div>
              <h4 className="text-sm font-semibold text-slate-200">
                Want to evaluate immediately?
              </h4>
              <p className="text-xs text-slate-400">
                Load a pre-configured real-world dilemma into the Decision Lab with one click.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {SAMPLE_SCENARIOS.map((sample) => (
              <button
                key={sample.id}
                onClick={() => onSelectSample(sample)}
                className="text-left p-3.5 rounded-lg border border-slate-800 hover:border-cyan-500/40 bg-slate-900/50 hover:bg-slate-800/60 transition-all group flex flex-col justify-between"
              >
                <div>
                  <span className="text-[10px] font-mono text-cyan-400 block mb-1">
                    {sample.tag}
                  </span>
                  <p className="text-xs font-medium text-slate-200 group-hover:text-white line-clamp-2">
                    {sample.title}
                  </p>
                </div>
                <div className="mt-3 flex items-center gap-1 text-[11px] text-cyan-400 font-mono">
                  <span>Load scenario</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
