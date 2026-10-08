import React, { useEffect, useState } from 'react';
import { Eye, ShieldAlert, Cpu, Sparkles, Layers, Activity } from 'lucide-react';

const SCAN_STAGES = [
  'Parsing decision boundaries & context variables...',
  'Extracting explicit factors from user submission...',
  'Detecting unstated premises & load-bearing assumptions...',
  'Probing for second-order blind spots & unmodeled dependencies...',
  'Auditing tensions between stated priorities and logic...',
  'Formulating inversion stress-tests & empirical verification gaps...',
  'Synthesizing final Decision X-Ray diagnostic readout...',
];

export const ScanningState: React.FC = () => {
  const [stageIndex, setStageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStageIndex((prev) => (prev < SCAN_STAGES.length - 1 ? prev + 1 : prev));
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="max-w-xl mx-auto px-4 py-20 text-center">
      <div className="relative mx-auto w-36 h-36 rounded-2xl border border-cyan-500/40 bg-slate-950/80 p-4 shadow-[0_0_50px_rgba(56,189,248,0.2)] flex items-center justify-center overflow-hidden mb-8">
        {/* Radar / Scan line sweep */}
        <div className="absolute inset-0 bg-grid-pattern opacity-40" />
        <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_#38bdf8] animate-scan-sweep pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center">
          <Activity className="w-12 h-12 text-cyan-400 animate-pulse" />
          <span className="text-[10px] font-mono text-cyan-300 mt-2 tracking-widest uppercase">
            SCANNING
          </span>
        </div>
      </div>

      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/40 border border-cyan-800/40 text-cyan-300 text-xs font-mono uppercase tracking-wider">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
          Gemini Cognitive Engine Active
        </div>

        <h3 className="text-xl sm:text-2xl font-bold text-white font-mono">
          CONDUCTING REASONING X-RAY
        </h3>

        <div className="h-10 flex items-center justify-center">
          <p className="text-sm font-mono text-slate-300 transition-all duration-300">
            {SCAN_STAGES[stageIndex]}
          </p>
        </div>

        {/* Progress Dots */}
        <div className="flex items-center justify-center gap-1.5 pt-2">
          {SCAN_STAGES.map((_, idx) => (
            <span
              key={idx}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                idx === stageIndex
                  ? 'w-6 bg-cyan-400'
                  : idx < stageIndex
                  ? 'w-2 bg-cyan-700'
                  : 'w-2 bg-slate-800'
              }`}
            />
          ))}
        </div>

        <p className="text-xs text-slate-500 max-w-sm mx-auto pt-4 font-sans">
          Examining the structure of your reasoning. We do not make the choice for you; we illuminate what lies beneath.
        </p>
      </div>
    </div>
  );
};
