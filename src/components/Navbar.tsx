import React from 'react';
import { Eye, ShieldAlert, Sparkles, RefreshCw, FileText } from 'lucide-react';

interface NavbarProps {
  currentView: 'landing' | 'lab' | 'results';
  onNavigate: (view: 'landing' | 'lab' | 'results') => void;
  hasActiveReport: boolean;
  onReset: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  hasActiveReport,
  onReset,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-[#07090e]/85 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <button
          onClick={() => onNavigate('landing')}
          className="flex items-center gap-3 group text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 rounded-lg p-1"
        >
          <div className="relative flex items-center justify-center w-9 h-9 rounded-lg bg-slate-900 border border-slate-700/60 group-hover:border-cyan-500/50 transition-colors overflow-hidden shadow-inner">
            <Eye className="w-5 h-5 text-cyan-400 group-hover:scale-105 transition-transform" />
            <div className="absolute inset-0 bg-cyan-400/10 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold tracking-wider text-base text-slate-100 font-mono">
                BLINDSPOT
              </span>
              <span className="hidden sm:inline-block text-[11px] font-mono tracking-widest text-cyan-400 uppercase">
                X-RAY
              </span>
            </div>
            <p className="text-[10px] text-slate-400 hidden md:block">
              Cognitive Reasoning Diagnostic
            </p>
          </div>
        </button>

        {/* Navigation Items */}
        <nav className="flex items-center gap-2 sm:gap-4">
          <button
            onClick={() => onNavigate('landing')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              currentView === 'landing'
                ? 'text-cyan-300 bg-cyan-950/40 border border-cyan-800/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Philosophy
          </button>

          <button
            onClick={() => onNavigate('lab')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              currentView === 'lab'
                ? 'text-cyan-300 bg-cyan-950/40 border border-cyan-800/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Decision Lab
          </button>

          {hasActiveReport && (
            <button
              onClick={() => onNavigate('results')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                currentView === 'results'
                  ? 'text-cyan-300 bg-cyan-950/40 border border-cyan-800/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-cyan-400" />
              <span>Active X-Ray</span>
            </button>
          )}

          {hasActiveReport && (
            <button
              onClick={onReset}
              title="Start a fresh decision analysis"
              className="flex items-center gap-1 px-2.5 py-1.5 text-xs text-slate-400 hover:text-rose-400 border border-slate-800 hover:border-rose-900/50 rounded-md transition-colors ml-1"
            >
              <RefreshCw className="w-3 h-3" />
              <span className="hidden sm:inline">New</span>
            </button>
          )}
        </nav>
      </div>
    </header>
  );
};
