import React, { useState, useEffect } from 'react';
import {
  FileText,
  ShieldAlert,
  HelpCircle,
  Flame,
  Printer,
  Copy,
  Check,
  RotateCcw,
  Sparkles,
  ArrowRight,
  Layers,
  Scale,
  Compass,
  AlertTriangle,
  Lightbulb,
  BookmarkCheck,
  Info,
} from 'lucide-react';
import { XRayReport, DecisionPayload } from '../types/xray';
import { EvidenceBadge, TraceabilityCard } from './EvidenceBadge';

interface ReasoningXRayDashboardProps {
  report: XRayReport;
  inputData: DecisionPayload;
  onChallenge: () => void;
  isChallenging: boolean;
  onNewDecision: () => void;
  onEditInputs: () => void;
}

const SECTION_NAV_ITEMS = [
  { id: 'sec-considered', label: 'Layer 01: Considered' },
  { id: 'sec-assumptions', label: 'Layer 02: Assumptions' },
  { id: 'sec-blindspots', label: 'Layer 03: Blind Spots' },
  { id: 'sec-tensions', label: 'Tensions' },
  { id: 'sec-evidence', label: 'Evidence Gaps' },
  { id: 'sec-perspectives', label: 'Perspectives' },
  { id: 'sec-questions', label: 'Questions' },
  { id: 'sec-stresstest', label: 'Stress Test' },
  { id: 'sec-reflection', label: 'Reflection' },
];

export const ReasoningXRayDashboard: React.FC<ReasoningXRayDashboardProps> = ({
  report,
  inputData,
  onChallenge,
  isChallenging,
  onNewDecision,
  onEditInputs,
}) => {
  const [reflection, setReflection] = useState('');
  const [reflectionSaved, setReflectionSaved] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeSection, setActiveSection] = useState('sec-considered');

  // Load reflection from localStorage
  useEffect(() => {
    try {
      const storageKey = `blindspot_reflection_${report.decision_summary.slice(0, 30)}`;
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        setReflection(saved);
        setReflectionSaved(true);
      }
    } catch (e) {
      // ignore storage errors
    }
  }, [report.decision_summary]);

  const handleSaveReflection = () => {
    try {
      const storageKey = `blindspot_reflection_${report.decision_summary.slice(0, 30)}`;
      localStorage.setItem(storageKey, reflection);
      setReflectionSaved(true);
      setTimeout(() => setReflectionSaved(false), 3500);
    } catch (e) {
      setReflectionSaved(true);
    }
  };

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -90;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const handleCopyMarkdown = () => {
    const text = `# BLINDSPOT: Decision X-Ray Diagnostic Report
Decision: ${report.decision_summary}

## A. LAYER 01 — What You Considered (From your reasoning)
${report.considered_factors.map((f) => `- [${f.evidence_level}] ${f.factor}`).join('\n')}

## B. LAYER 02 — Hidden Assumptions
${report.hidden_assumptions.map((a) => `### [${a.evidence_level}] ${a.assumption}\n- Why it matters: ${a.why_it_matters}\n- Confidence: ${a.confidence}\n- How to verify: ${a.how_to_verify}\n- Reasoning basis: ${a.reasoning_evidence}\n- Traceability: ${a.traceability_why}`).join('\n\n')}

## C. LAYER 03 — Potential Blind Spots
${report.blind_spots.map((b) => `### [${b.evidence_level}] What may be missing: ${b.factor}\n- Why it matters: ${b.why_it_matters}\n- What to investigate: ${b.evidence_to_seek}\n- Traceability: ${b.traceability_why}`).join('\n\n')}

## D. Reasoning Tensions
${report.reasoning_tensions.map((t) => `- [${t.evidence_level}]\n  You say this matters: ${t.stated_priority}\n  Your reasoning emphasizes: ${t.reasoning_pattern}\n  Potential tension: ${t.potential_tension}\n  Traceability: ${t.traceability_why}`).join('\n\n')}

## E. Evidence Gaps
${report.evidence_gaps.map((g) => `- [${g.evidence_level}] Unknown: ${g.unknown}\n  Why it matters: ${g.why_it_matters}\n  How to verify: ${g.how_to_verify}`).join('\n\n')}

## F. Alternative Perspectives
${report.alternative_perspectives.map((p) => `### ${p.perspective}\n${p.what_it_highlights}`).join('\n\n')}

## G. Questions Worth Exploring
${report.questions_to_explore.map((q, idx) => `${idx + 1}. ${q}`).join('\n')}

## H. Stress Test: What would have to be true for your reasoning to be wrong?
${report.stress_test.map((s) => `- [${s.evidence_level}] Current assumption: ${s.assumption}\n  What could challenge it: ${s.what_would_make_it_wrong}\n  Evidence that would help: ${s.evidence_that_would_help}`).join('\n\n')}
`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      {/* Top Banner & Header */}
      <div className="border-b border-slate-800 pb-8 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-semibold">
              Evidence-Grounded Diagnostic
            </span>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyMarkdown}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono text-slate-300 hover:text-white bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-lg transition-colors"
              title="Copy markdown synthesis"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Synthesis'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono text-slate-300 hover:text-white bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-lg transition-colors"
              title="Print or save as PDF"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Print</span>
            </button>

            <button
              onClick={onEditInputs}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono text-slate-300 hover:text-cyan-300 bg-slate-900 border border-slate-800 hover:border-cyan-800 rounded-lg transition-colors"
            >
              <span>Edit Inputs</span>
            </button>

            <button
              onClick={onNewDecision}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono text-slate-400 hover:text-rose-400 bg-slate-950 border border-slate-800 rounded-lg transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">New Decision</span>
            </button>
          </div>
        </div>

        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-mono">
            YOUR REASONING X-RAY
          </h1>
          <p className="text-sm sm:text-base text-slate-300 mt-2 font-sans max-w-3xl leading-relaxed">
            {report.decision_summary}
          </p>
        </div>

        {/* Evidence Classification Standard Banner */}
        <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-900/40 text-xs text-slate-300 space-y-2">
          <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-400 uppercase tracking-wider font-semibold">
            <Info className="w-3.5 h-3.5 text-cyan-400" />
            <span>Evidence Classification Standard</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-0.5">
            <div className="flex items-center gap-2 text-[11px]">
              <EvidenceBadge level="USER-STATED" />
              <span className="text-slate-400">Explicitly stated by you</span>
            </div>
            <div className="flex items-center gap-2 text-[11px]">
              <EvidenceBadge level="INFERRED" />
              <span className="text-slate-400">Reasonably inferred from facts</span>
            </div>
            <div className="flex items-center gap-2 text-[11px]">
              <EvidenceBadge level="HYPOTHESIS TO VERIFY" />
              <span className="text-slate-400">Relevant possibility to verify</span>
            </div>
          </div>
        </div>

        {/* 4 Summary Metrics (Clearly labeled as reasoning signals, NOT a decision score) */}
        <div className="pt-2">
          <div className="text-[11px] font-mono text-slate-400 uppercase tracking-widest mb-2 flex items-center justify-between">
            <span className="text-cyan-300 font-bold">REASONING SIGNALS</span>
          </div>
          <p className="text-xs text-slate-400 mb-3 italic">
            These signals describe your analysis, not whether your decision is right or wrong.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 backdrop-blur-sm">
              <span className="text-[11px] font-mono text-slate-400 block mb-1">
                Factors Considered
              </span>
              <div className="text-2xl sm:text-3xl font-bold font-mono text-emerald-400">
                {report.considered_factors.length}
              </div>
              <span className="text-[10px] text-slate-500 mt-1 block">
                Explicit elements
              </span>
            </div>

            <div className="p-4 rounded-xl border border-cyan-900/40 bg-cyan-950/20 backdrop-blur-sm">
              <span className="text-[11px] font-mono text-cyan-300 block mb-1">
                Hidden Assumptions
              </span>
              <div className="text-2xl sm:text-3xl font-bold font-mono text-cyan-400">
                {report.hidden_assumptions.length}
              </div>
              <span className="text-[10px] text-cyan-500/80 mt-1 block">
                Unstated premises
              </span>
            </div>

            <div className="p-4 rounded-xl border border-amber-900/40 bg-amber-950/20 backdrop-blur-sm">
              <span className="text-[11px] font-mono text-amber-300 block mb-1">
                Potential Blind Spots
              </span>
              <div className="text-2xl sm:text-3xl font-bold font-mono text-amber-400">
                {report.blind_spots.length}
              </div>
              <span className="text-[10px] text-amber-500/80 mt-1 block">
                Overlooked variables
              </span>
            </div>

            <div className="p-4 rounded-xl border border-indigo-900/40 bg-indigo-950/20 backdrop-blur-sm">
              <span className="text-[11px] font-mono text-indigo-300 block mb-1">
                Evidence Gaps
              </span>
              <div className="text-2xl sm:text-3xl font-bold font-mono text-indigo-400">
                {report.evidence_gaps.length}
              </div>
              <span className="text-[10px] text-indigo-400/80 mt-1 block">
                Empirical unknowns
              </span>
            </div>
          </div>
        </div>

        {/* CHALLENGE MY REASONING Trigger Banner */}
        <div className="p-4 rounded-xl border border-rose-900/50 bg-gradient-to-r from-rose-950/40 via-slate-900/60 to-rose-950/30 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-rose-950 border border-rose-700/60 flex items-center justify-center text-rose-400 shrink-0">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white font-mono">
                Adversarial Review
              </h4>
              <p className="text-xs text-slate-400">
                Stress-test your strongest assumption and identify missing evidence with evidence ratings.
              </p>
            </div>
          </div>

          <button
            onClick={onChallenge}
            disabled={isChallenging}
            className="w-full sm:w-auto px-5 py-2.5 text-xs font-mono font-bold text-rose-100 bg-rose-900/70 hover:bg-rose-800 border border-rose-700/80 rounded-lg shadow-[0_0_15px_rgba(244,63,94,0.25)] transition-all hover:scale-[1.02] flex items-center justify-center gap-2 shrink-0 disabled:opacity-60"
          >
            <Flame className="w-4 h-4 text-rose-400" />
            <span>{isChallenging ? 'AUDITING...' : 'CHALLENGE MY REASONING'}</span>
          </button>
        </div>
      </div>

      {/* Sticky Compact Section Navigator */}
      <nav aria-label="Report section navigation" className="sticky top-16 z-30 py-2.5 -mx-4 sm:-mx-6 px-4 sm:px-6 bg-[#07090e]/90 backdrop-blur-md border-y border-slate-800/80 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-1.5 min-w-max">
          {SECTION_NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className={`px-3 py-1 text-xs font-mono rounded-md transition-colors ${
                activeSection === item.id
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </nav>

      {/* A. WHAT YOU CONSIDERED (LAYER 01: VISIBLE ARGUMENTS) */}
      <section id="sec-considered" className="scroll-mt-32 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">
              Layer 01
            </span>
            <span className="text-slate-600">·</span>
            <h2 className="text-xl font-bold text-white font-mono">
              WHAT YOU CONSIDERED
            </h2>
          </div>
          <span className="text-[11px] font-mono text-emerald-400">Visible Arguments</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span className="font-mono text-emerald-400 font-semibold">From your reasoning</span>
          <span className="text-slate-600">·</span>
          <span>These factors reflect what you shared in your input, not independently verified facts.</span>
        </div>

        {report.considered_factors.length === 0 ? (
          <div className="p-4 rounded-lg border border-slate-800 bg-slate-900/30 text-xs text-slate-400">
            No explicit factors extracted.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {report.considered_factors.map((item, idx) => (
              <div
                key={idx}
                className="p-4 rounded-lg border border-slate-800 bg-slate-900/40 flex items-start justify-between gap-3"
              >
                <div className="space-y-1.5 flex-1">
                  <p className="text-xs sm:text-sm text-slate-200 leading-snug">
                    {item.factor}
                  </p>
                  <div className="flex items-center gap-2 text-[10px] font-mono text-slate-500">
                    <span>Source:</span>
                    <span className="text-emerald-400">Explicitly stated in reasoning</span>
                  </div>
                </div>
                <EvidenceBadge level={item.evidence_level || 'USER-STATED'} />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* B. HIDDEN ASSUMPTIONS (LAYER 02: UNSTATED PREMISES) */}
      <section id="sec-assumptions" className="scroll-mt-32 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
              Layer 02
            </span>
            <span className="text-slate-600">·</span>
            <h2 className="text-xl font-bold text-white font-mono">
              HIDDEN ASSUMPTIONS
            </h2>
          </div>
          <span className="text-[11px] font-mono text-cyan-400">Unstated Premises</span>
        </div>
        <p className="text-xs text-slate-400">
          Unstated premises your logic appears to assume without empirical verification.
        </p>

        {report.hidden_assumptions.length === 0 ? (
          <div className="p-4 rounded-lg border border-slate-800 bg-slate-900/30 text-xs text-slate-400">
            No unstated assumptions detected.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {report.hidden_assumptions.map((item, idx) => {
              const confColor =
                item.confidence === 'high'
                  ? 'text-rose-400'
                  : item.confidence === 'medium'
                  ? 'text-amber-400'
                  : 'text-cyan-400';

              return (
                <div
                  key={idx}
                  className="p-5 rounded-xl border border-cyan-900/40 bg-slate-900/50 space-y-3.5 flex flex-col justify-between"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between text-[11px] font-mono gap-2">
                      <span className="text-slate-400">Assumption #{idx + 1}</span>
                      <EvidenceBadge level={item.evidence_level || 'INFERRED'} />
                    </div>

                    <div>
                      <span className="text-[10px] font-mono uppercase text-cyan-400 block mb-0.5">
                        ASSUMPTION
                      </span>
                      <h3 className="text-sm font-semibold text-white leading-snug">
                        "{item.assumption}"
                      </h3>
                    </div>

                    <div>
                      <span className="text-[10px] font-mono uppercase text-slate-400 block mb-0.5">
                        WHY IT MATTERS
                      </span>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {item.why_it_matters}
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5 text-[11px] font-mono">
                      <span className="text-slate-500">Confidence:</span>
                      <span className={`${confColor} uppercase font-bold`}>{item.confidence}</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-800 space-y-2 text-xs">
                    <div>
                      <span className="text-[10px] font-mono uppercase text-cyan-300 block mb-0.5 font-semibold">
                        HOW TO VERIFY
                      </span>
                      <p className="text-cyan-100 font-sans leading-relaxed">
                        {item.how_to_verify || 'Seek empirical validation with neutral peers or leading indicators.'}
                      </p>
                    </div>

                    <div className="text-[11px] text-slate-400 italic">
                      Reasoning basis: "{item.reasoning_evidence}"
                    </div>

                    <TraceabilityCard whyText={item.traceability_why} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* C. POTENTIAL BLIND SPOTS (LAYER 03: OVERLOOKED VULNERABILITIES) */}
      <section id="sec-blindspots" className="scroll-mt-32 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">
              Layer 03
            </span>
            <span className="text-slate-600">·</span>
            <h2 className="text-xl font-bold text-white font-mono">
              POTENTIAL BLIND SPOTS
            </h2>
          </div>
          <span className="text-[11px] font-mono text-amber-400">Overlooked Variables</span>
        </div>
        <p className="text-xs text-slate-400">
          Downstream risks, unmodeled dependencies, or second-order consequences missing from your stated rationale.
        </p>

        {report.blind_spots.length === 0 ? (
          <div className="p-4 rounded-lg border border-slate-800 bg-slate-900/30 text-xs text-slate-400">
            No critical blind spots detected.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {report.blind_spots.map((item, idx) => (
              <div
                key={idx}
                className="p-5 rounded-xl border border-amber-900/40 bg-slate-900/50 space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between text-[11px] font-mono text-amber-400 gap-2">
                    <span className="flex items-center gap-1.5">
                      <ShieldAlert className="w-4 h-4 text-amber-400" />
                      <span>Blind Spot #{idx + 1}</span>
                    </span>
                    <EvidenceBadge level={item.evidence_level || 'HYPOTHESIS TO VERIFY'} />
                  </div>

                  <div>
                    <span className="text-[10px] font-mono uppercase text-amber-300 block mb-0.5 font-semibold">
                      WHAT MAY BE MISSING
                    </span>
                    <h3 className="text-sm font-semibold text-white leading-snug">
                      {item.factor}
                    </h3>
                  </div>

                  <div>
                    <span className="text-[10px] font-mono uppercase text-slate-400 block mb-0.5">
                      WHY IT MATTERS
                    </span>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {item.why_it_matters}
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800 space-y-2">
                  <div>
                    <span className="text-[10px] font-mono uppercase text-amber-300 block mb-0.5 font-semibold">
                      WHAT TO INVESTIGATE
                    </span>
                    <p className="text-xs text-amber-100 font-sans leading-relaxed">
                      {item.evidence_to_seek}
                    </p>
                  </div>

                  <TraceabilityCard whyText={item.traceability_why} />
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* D. REASONING TENSIONS */}
      <section id="sec-tensions" className="scroll-mt-32 space-y-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-wider">
            Section D
          </span>
          <span className="text-slate-600">·</span>
          <h2 className="text-xl font-bold text-white font-mono">
            REASONING TENSIONS
          </h2>
        </div>
        <p className="text-xs text-slate-400">
          Subtle misalignments between what you state matters and the pattern your reasoning emphasizes.
        </p>

        {report.reasoning_tensions.length === 0 ? (
          <div className="p-4 rounded-lg border border-slate-800 bg-slate-900/30 text-xs text-slate-400">
            No overt reasoning tensions detected.
          </div>
        ) : (
          <div className="space-y-4">
            {report.reasoning_tensions.map((tension, idx) => (
              <div
                key={idx}
                className="p-5 sm:p-6 rounded-xl border border-indigo-900/40 bg-slate-900/60 space-y-4"
              >
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="text-slate-400">Tension Analysis #{idx + 1}</span>
                  <EvidenceBadge level={tension.evidence_level || 'INFERRED'} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-slate-950/70 border border-slate-800">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block mb-1">
                      YOU SAY THIS MATTERS
                    </span>
                    <p className="text-sm font-semibold text-indigo-300 font-sans">
                      {tension.stated_priority}
                    </p>
                  </div>

                  <div className="p-4 rounded-lg bg-slate-950/70 border border-slate-800">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block mb-1">
                      YOUR REASONING EMPHASIZES
                    </span>
                    <p className="text-sm text-slate-200 font-sans">
                      {tension.reasoning_pattern}
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-lg border border-indigo-800/40 bg-indigo-950/20">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-indigo-400 font-bold block mb-1">
                    POTENTIAL TENSION
                  </span>
                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans">
                    {tension.potential_tension}
                  </p>
                </div>

                <TraceabilityCard whyText={tension.traceability_why} />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* E. EVIDENCE GAPS */}
      <section id="sec-evidence" className="scroll-mt-32 space-y-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold text-sky-400 uppercase tracking-wider">
            Section E
          </span>
          <span className="text-slate-600">·</span>
          <h2 className="text-xl font-bold text-white font-mono">
            EVIDENCE GAPS
          </h2>
        </div>
        <p className="text-xs text-slate-400">
          Turning uncertainty into actionable empirical investigation before you commit.
        </p>

        {report.evidence_gaps.length === 0 ? (
          <div className="p-4 rounded-lg border border-slate-800 bg-slate-900/30 text-xs text-slate-400">
            No critical evidence gaps noted.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {report.evidence_gaps.map((item, idx) => (
              <div
                key={idx}
                className="p-5 rounded-xl border border-slate-800 bg-slate-900/50 space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[10px] font-mono text-sky-400">
                    <span>UNKNOWN #{idx + 1}</span>
                    <EvidenceBadge level={item.evidence_level || 'HYPOTHESIS TO VERIFY'} />
                  </div>
                  <h3 className="text-xs sm:text-sm font-semibold text-white leading-snug">
                    {item.unknown}
                  </h3>
                  <div className="pt-1">
                    <span className="text-[10px] font-mono uppercase text-slate-400 block mb-0.5">
                      WHY IT MATTERS
                    </span>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {item.why_it_matters}
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800 text-xs">
                  <span className="text-[10px] font-mono uppercase text-sky-400 block mb-0.5 font-semibold">
                    HOW TO VERIFY
                  </span>
                  <p className="text-slate-200 font-sans leading-relaxed">
                    {item.how_to_verify}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* F. ALTERNATIVE PERSPECTIVES */}
      <section id="sec-perspectives" className="scroll-mt-32 space-y-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold text-purple-400 uppercase tracking-wider">
            Section F
          </span>
          <span className="text-slate-600">·</span>
          <h2 className="text-xl font-bold text-white font-mono">
            ALTERNATIVE PERSPECTIVES
          </h2>
        </div>
        <p className="text-xs text-slate-400">
          Vantage points that illuminate dimensions your primary narrative deprioritizes.
        </p>

        {report.alternative_perspectives.length === 0 ? (
          <div className="p-4 rounded-lg border border-slate-800 bg-slate-900/30 text-xs text-slate-400">
            No alternative perspectives compiled.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {report.alternative_perspectives.map((item, idx) => (
              <div
                key={idx}
                className="p-5 rounded-xl border border-purple-900/30 bg-purple-950/15 space-y-2 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="text-[11px] font-mono text-purple-300 uppercase tracking-wider font-bold">
                      {item.perspective}
                    </span>
                    <EvidenceBadge level={item.evidence_level || 'INFERRED'} />
                  </div>
                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans">
                    {item.what_it_highlights}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* G. QUESTIONS WORTH EXPLORING */}
      <section id="sec-questions" className="scroll-mt-32 space-y-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
            Section G
          </span>
          <span className="text-slate-600">·</span>
          <h2 className="text-xl font-bold text-white font-mono">
            QUESTIONS WORTH EXPLORING
          </h2>
        </div>
        <p className="text-xs text-slate-400">
          High-quality, decision-specific questions to examine before committing.
        </p>

        {report.questions_to_explore.length === 0 ? (
          <div className="p-4 rounded-lg border border-slate-800 bg-slate-900/30 text-xs text-slate-400">
            No exploratory questions generated.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {report.questions_to_explore.map((question, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl border border-slate-800 bg-slate-900/40 flex items-start gap-3.5 group hover:border-cyan-800/60 transition-colors"
              >
                <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-950/80 border border-cyan-800/40 w-6 h-6 rounded flex items-center justify-center shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans">
                  {question}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* H. STRESS TEST */}
      <section id="sec-stresstest" className="scroll-mt-32 p-6 sm:p-7 rounded-2xl border border-rose-900/40 bg-gradient-to-b from-slate-950 to-rose-950/20 space-y-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-rose-400 uppercase tracking-wider">
              Section H
            </span>
            <span className="text-slate-600">·</span>
            <h2 className="text-xl font-bold text-white font-mono">
              STRESS TEST
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-rose-200/90 font-mono font-semibold">
            WHAT WOULD HAVE TO BE TRUE FOR YOUR REASONING TO BE WRONG?
          </p>
        </div>

        {report.stress_test.length === 0 ? (
          <div className="p-4 rounded-lg border border-slate-800 bg-slate-900/30 text-xs text-slate-400">
            No stress-test conditions compiled.
          </div>
        ) : (
          <div className="space-y-3 pt-2">
            {report.stress_test.map((item, idx) => (
              <div
                key={idx}
                className="p-4 sm:p-5 rounded-xl border border-slate-800 bg-slate-900/60 space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="text-[11px] font-mono text-slate-400">
                    Inversion Test #{idx + 1}
                  </span>
                  <EvidenceBadge level={item.evidence_level || 'INFERRED'} />
                </div>

                <div>
                  <span className="text-[10px] font-mono uppercase text-slate-400 block mb-0.5">
                    CURRENT ASSUMPTION
                  </span>
                  <h4 className="text-xs sm:text-sm font-semibold text-white leading-snug">
                    "{item.assumption}"
                  </h4>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs pt-1">
                  <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800">
                    <span className="text-[10px] font-mono text-rose-400 uppercase block mb-1 font-semibold">
                      WHAT COULD CHALLENGE IT
                    </span>
                    <p className="text-slate-300 font-sans leading-relaxed">{item.what_would_make_it_wrong}</p>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800">
                    <span className="text-[10px] font-mono text-cyan-400 uppercase block mb-1 font-semibold">
                      EVIDENCE THAT WOULD HELP
                    </span>
                    <p className="text-slate-300 font-sans leading-relaxed">{item.evidence_that_would_help}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* REFLECTION SECTION */}
      <section id="sec-reflection" className="scroll-mt-32 p-6 sm:p-8 rounded-2xl border border-slate-800 bg-slate-900/50 space-y-4">
        <div>
          <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest block mb-1">
            INTEGRATION WORKSPACE
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-white font-mono">
            WHAT CHANGED IN YOUR THINKING?
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            {report.reflection_prompt || 'Did this analysis reveal anything you had not previously considered?'}
          </p>
        </div>

        <div className="space-y-3">
          <textarea
            value={reflection}
            onChange={(e) => setReflection(e.target.value)}
            rows={4}
            placeholder="Did this analysis reveal anything you hadn't considered?"
            className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all font-sans"
          />

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
            <button
              onClick={handleSaveReflection}
              className="w-full sm:w-auto px-6 py-2.5 text-xs font-mono font-bold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-all flex items-center justify-center gap-2"
            >
              {reflectionSaved ? <Check className="w-4 h-4 text-slate-950" /> : <BookmarkCheck className="w-4 h-4 text-slate-950" />}
              <span>{reflectionSaved ? 'Reflection Saved' : 'SAVE REFLECTION'}</span>
            </button>

            <p className="text-xs text-slate-400 font-sans text-center sm:text-right">
              Stored only locally in your browser.
            </p>
          </div>
        </div>
      </section>

      {/* Mandatory Closing Ethos */}
      <div className="py-6 text-center border-t border-slate-800/80">
        <p className="text-sm font-mono text-cyan-400 font-semibold tracking-wide">
          "BlindSpot does not decide for you. It helps you examine what may be missing."
        </p>
      </div>
    </div>
  );
};
