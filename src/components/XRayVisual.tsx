import React from 'react';
import { Scan, ShieldAlert, Cpu, Eye, GitBranch, Layers } from 'lucide-react';

export const XRayVisual: React.FC = () => {
  return (
    <div className="relative w-full max-w-xl mx-auto rounded-xl border border-cyan-900/40 bg-slate-950/70 p-5 overflow-hidden shadow-2xl backdrop-blur-md">
      {/* Grid Pattern Background */}
      <div className="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none" />

      {/* Sweeping Laser Scan Line */}
      <div className="absolute inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_12px_#38bdf8] animate-scan-sweep pointer-events-none z-10" />

      {/* Reticle / Medical Diagnostic Frame Elements */}
      <div className="absolute top-2 left-2 text-[10px] font-mono text-cyan-500/60 uppercase tracking-widest flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping inline-block" />
        REASONING DIAGNOSTIC // ACTIVE
      </div>
      <div className="absolute top-2 right-2 text-[10px] font-mono text-slate-500">
        SPEC: COGNITIVE AUDIT
      </div>

      <div className="pt-6 pb-2 space-y-3 relative z-0">
        {/* Layer 1: Visible Arguments */}
        <div className="p-3 rounded-lg border border-slate-800 bg-slate-900/60 transition-all hover:border-slate-700">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="font-mono text-slate-400 flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-slate-400" />
              LAYER 01: VISIBLE ARGUMENTS
            </span>
            <span className="text-[10px] text-emerald-300 font-mono font-bold bg-emerald-950/70 border border-emerald-700/60 px-2 py-0.5 rounded">
              [USER-STATED]
            </span>
          </div>
          <p className="text-xs text-slate-300 font-sans">
            "I want to take the startup role because high growth accelerates my career and the market is booming."
          </p>
        </div>

        {/* Layer 2: Unstated Assumptions (Illuminated by X-Ray) */}
        <div className="p-3 rounded-lg border border-cyan-800/50 bg-cyan-950/20 transition-all shadow-[0_0_15px_rgba(56,189,248,0.06)]">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="font-mono text-cyan-300 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
              LAYER 02: HIDDEN ASSUMPTIONS
            </span>
            <span className="text-[10px] text-sky-300 font-mono font-bold bg-sky-950/70 border border-sky-700/60 px-2 py-0.5 rounded">
              [INFERRED]
            </span>
          </div>
          <p className="text-xs text-cyan-100 font-sans">
            "Your reasoning appears to assume that a prestigious venture-backed startup will automatically provide deeper engineering mastery than an enterprise platform."
          </p>
        </div>

        {/* Layer 3: Overlooked Blind Spots */}
        <div className="p-3 rounded-lg border border-amber-900/40 bg-amber-950/15 transition-all">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="font-mono text-amber-300 flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
              LAYER 03: OVERLOOKED BLIND SPOT
            </span>
            <span className="text-[10px] text-amber-300 font-mono font-bold bg-amber-950/70 border border-amber-700/60 px-2 py-0.5 rounded">
              [HYPOTHESIS TO VERIFY]
            </span>
          </div>
          <p className="text-xs text-slate-300 font-sans">
            Potential second-order effect to verify: Could the non-linear operational firefighting at an early-stage company reduce the actual time allocated to technical skill development?
          </p>
        </div>
      </div>

      {/* Bottom Diagnostic Readout */}
      <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-400">
        <span>INSPECTION DEPTH: DEEP</span>
        <span className="text-cyan-400/80">REASONING X-RAY PROTOCOL</span>
      </div>
    </div>
  );
};
