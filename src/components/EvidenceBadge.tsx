import React, { useState } from 'react';
import { EvidenceLevel } from '../types/xray';
import { Info, HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';

interface EvidenceBadgeProps {
  level: EvidenceLevel;
  className?: string;
}

export const EvidenceBadge: React.FC<EvidenceBadgeProps> = ({ level, className = '' }) => {
  let colorStyles = '';
  let dotColor = '';

  switch (level) {
    case 'USER-STATED':
      colorStyles = 'bg-emerald-950/70 text-emerald-300 border-emerald-700/60 shadow-[0_0_10px_rgba(52,211,153,0.15)]';
      dotColor = 'bg-emerald-400';
      break;
    case 'INFERRED':
      colorStyles = 'bg-sky-950/70 text-sky-300 border-sky-700/60 shadow-[0_0_10px_rgba(56,189,248,0.15)]';
      dotColor = 'bg-sky-400';
      break;
    case 'HYPOTHESIS TO VERIFY':
    default:
      colorStyles = 'bg-amber-950/70 text-amber-300 border-amber-700/60 shadow-[0_0_10px_rgba(251,191,36,0.15)]';
      dotColor = 'bg-amber-400';
      break;
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[10px] font-mono font-bold tracking-wider uppercase border ${colorStyles} ${className}`}
      title={
        level === 'USER-STATED'
          ? 'Explicitly stated by you in your input'
          : level === 'INFERRED'
          ? 'Reasonably inferred from information explicitly provided by you'
          : 'Hypothesis to verify: AI identifies this as potentially relevant, but your input does not establish it as fact'
      }
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
      <span>[{level}]</span>
    </span>
  );
};

interface TraceabilityCardProps {
  whyText: string;
}

export const TraceabilityCard: React.FC<TraceabilityCardProps> = ({ whyText }) => {
  const [isOpen, setIsOpen] = useState(false);

  if (!whyText) return null;

  return (
    <div className="pt-2 border-t border-slate-800/80">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 text-[11px] font-mono text-cyan-400 hover:text-cyan-300 transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-cyan-500 rounded py-0.5"
      >
        <HelpCircle className="w-3.5 h-3.5" />
        <span>Why did BlindSpot identify this?</span>
        {isOpen ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
      </button>

      {isOpen && (
        <div className="mt-2 p-3 rounded-lg bg-slate-950/90 border border-cyan-900/40 text-xs text-slate-300 leading-relaxed font-sans shadow-inner">
          <span className="text-[10px] font-mono uppercase text-cyan-400 font-bold block mb-1">
            SOURCE TRACEABILITY:
          </span>
          <p>{whyText}</p>
        </div>
      )}
    </div>
  );
};
