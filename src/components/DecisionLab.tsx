import React, { useState } from 'react';
import { Sparkles, ArrowLeft, AlertCircle, CheckCircle2, RefreshCw, HelpCircle, Layers } from 'lucide-react';
import { DecisionPayload } from '../types/xray';
import { SAMPLE_SCENARIOS, SampleScenario } from '../data/sampleScenarios';

interface DecisionLabProps {
  initialData?: DecisionPayload;
  onSubmit: (data: DecisionPayload) => void;
  isLoading: boolean;
  onBack: () => void;
}

const DEFAULT_PRIORITY_OPTIONS = [
  'Career',
  'Money',
  'Learning',
  'Time',
  'Family',
  'Education',
  'Health',
  'Location',
  'Growth',
  'Stability',
  'Other',
];

export const DecisionLab: React.FC<DecisionLabProps> = ({
  initialData,
  onSubmit,
  isLoading,
  onBack,
}) => {
  const [decision, setDecision] = useState(initialData?.decision || '');
  const [context, setContext] = useState(initialData?.context || '');
  const [reasoning, setReasoning] = useState(initialData?.reasoning || '');
  const [selectedPriorities, setSelectedPriorities] = useState<string[]>(
    initialData?.priorities && initialData.priorities.length > 0
      ? initialData.priorities
      : ['Career', 'Growth']
  );
  const [otherPriorityText, setOtherPriorityText] = useState('');
  const [blindSpotConcerns, setBlindSpotConcerns] = useState(
    initialData?.blindSpotConcerns || ''
  );
  const [errors, setErrors] = useState<{ decision?: string; reasoning?: string }>({});

  const togglePriority = (p: string) => {
    if (selectedPriorities.includes(p)) {
      setSelectedPriorities(selectedPriorities.filter((item) => item !== p));
    } else {
      setSelectedPriorities([...selectedPriorities, p]);
    }
  };

  const loadScenario = (scenario: SampleScenario) => {
    setDecision(scenario.decision);
    setContext(scenario.context);
    setReasoning(scenario.reasoning);
    setSelectedPriorities(scenario.priorities);
    setBlindSpotConcerns(scenario.blindSpotConcerns);
    setErrors({});
  };

  const handleClear = () => {
    setDecision('');
    setContext('');
    setReasoning('');
    setSelectedPriorities(['Career', 'Growth']);
    setOtherPriorityText('');
    setBlindSpotConcerns('');
    setErrors({});
  };

  const validate = () => {
    const newErrors: { decision?: string; reasoning?: string } = {};
    if (!decision.trim()) {
      newErrors.decision = 'Please state the decision you are currently evaluating.';
    } else if (decision.trim().length < 10) {
      newErrors.decision = 'Please provide a bit more detail on what choice you are considering.';
    }

    if (!reasoning.trim()) {
      newErrors.reasoning = 'Please explain why you are leaning this way—this is what the X-Ray examines.';
    } else if (reasoning.trim().length < 15) {
      newErrors.reasoning = 'Please elaborate on your current thinking or rationale so we can detect assumptions.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    // Combine priorities including custom text if "Other" is checked
    const finalPriorities = selectedPriorities.filter((p) => p !== 'Other');
    if (selectedPriorities.includes('Other') && otherPriorityText.trim()) {
      finalPriorities.push(otherPriorityText.trim());
    }

    onSubmit({
      decision: decision.trim(),
      context: context.trim(),
      reasoning: reasoning.trim(),
      priorities: finalPriorities.length > 0 ? finalPriorities : ['Growth'],
      blindSpotConcerns: blindSpotConcerns.trim(),
    });
  };

  // Keyboard shortcut: Cmd/Ctrl + Enter
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12" onKeyDown={handleKeyDown}>
      {/* Top Header & Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <button
            onClick={onBack}
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-cyan-400 font-mono transition-colors mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Overview
          </button>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight font-mono">
            DECISION LAB
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Input your situation and reasoning. BlindSpot will perform an X-Ray audit on your underlying assumptions.
          </p>
        </div>

        {/* Quick Sample Selector */}
        <div className="flex items-center gap-2">
          <div className="relative group">
            <button
              type="button"
              className="px-3 py-1.5 text-xs font-mono text-cyan-300 bg-cyan-950/40 hover:bg-cyan-900/40 border border-cyan-800/40 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <span>Load Sample Dilemma</span>
            </button>
            <div className="absolute right-0 mt-1 w-64 p-2 bg-slate-900 border border-slate-800 rounded-lg shadow-2xl opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-all z-30">
              <p className="text-[10px] font-mono text-slate-400 px-2 py-1 uppercase tracking-wider">
                Select a preset:
              </p>
              {SAMPLE_SCENARIOS.map((scenario) => (
                <button
                  key={scenario.id}
                  type="button"
                  onClick={() => loadScenario(scenario)}
                  className="w-full text-left px-2 py-1.5 text-xs text-slate-300 hover:text-cyan-300 hover:bg-slate-800/80 rounded transition-colors"
                >
                  {scenario.title}
                </button>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={handleClear}
            className="px-3 py-1.5 text-xs font-mono text-slate-400 hover:text-slate-200 border border-slate-800 hover:border-slate-700 rounded-lg transition-colors"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Reminder Banner */}
      <div className="my-6 p-4 rounded-xl border border-cyan-900/30 bg-cyan-950/20 flex items-start gap-3">
        <HelpCircle className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
        <div className="text-xs text-slate-300 leading-relaxed">
          <strong className="text-cyan-300 font-semibold font-mono">Cognitive Audit Rule:</strong> We don’t evaluate whether your choice is "right" or "wrong". We illuminate what you are taking for granted, what external dependencies exist, and what tensions reside in your reasoning.
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* SECTION 01 */}
        <div className="p-6 rounded-xl border border-slate-800/90 bg-slate-900/40 backdrop-blur-sm space-y-3">
          <div className="flex items-center justify-between">
            <label htmlFor="section-decision" className="block text-sm font-bold text-white font-mono uppercase tracking-wider">
              SECTION 01: What are you deciding? <span className="text-rose-400">*</span>
            </label>
            <span className="text-[11px] font-mono text-slate-500">
              Required
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Define the dilemma clearly. What specific fork in the road are you facing?
          </p>
          <textarea
            id="section-decision"
            value={decision}
            onChange={(e) => {
              setDecision(e.target.value);
              if (errors.decision) setErrors({ ...errors, decision: undefined });
            }}
            rows={3}
            placeholder="e.g., Whether to leave my stable senior engineering job to join a 5-person AI startup as founding engineer with equity and lower pay..."
            className={`w-full px-4 py-3 rounded-lg bg-slate-950/80 border text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-2 transition-all ${
              errors.decision
                ? 'border-rose-500/70 focus:ring-rose-500/30'
                : 'border-slate-800 focus:border-cyan-500/60 focus:ring-cyan-500/20'
            }`}
          />
          {errors.decision && (
            <div className="flex items-center gap-1.5 text-xs text-rose-400 font-medium">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{errors.decision}</span>
            </div>
          )}
        </div>

        {/* SECTION 02 */}
        <div className="p-6 rounded-xl border border-slate-800/90 bg-slate-900/40 backdrop-blur-sm space-y-3">
          <div className="flex items-center justify-between">
            <label htmlFor="section-context" className="block text-sm font-bold text-white font-mono uppercase tracking-wider">
              SECTION 02: What do you know?
            </label>
            <span className="text-[11px] font-mono text-slate-500">
              Context & Facts
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Provide known facts, timeline, financial figures, stakeholder constraints, or alternatives on the table.
          </p>
          <textarea
            id="section-context"
            value={context}
            onChange={(e) => setContext(e.target.value)}
            rows={4}
            placeholder="e.g., Current compensation is $280k total. Startup offers $170k + 1.8% equity. I have 14 months of savings. My partner is supportive and works remotely. The startup has 18 months of runway..."
            className="w-full px-4 py-3 rounded-lg bg-slate-950/80 border border-slate-800 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-cyan-500/60 focus:ring-2 focus:ring-cyan-500/20 transition-all"
          />
        </div>

        {/* SECTION 03 */}
        <div className="p-6 rounded-xl border border-slate-800/90 bg-slate-900/40 backdrop-blur-sm space-y-3">
          <div className="flex items-center justify-between">
            <label htmlFor="section-reasoning" className="block text-sm font-bold text-white font-mono uppercase tracking-wider">
              SECTION 03: Why are you leaning this way? <span className="text-rose-400">*</span>
            </label>
            <span className="text-[11px] font-mono text-cyan-400">
              Target for X-Ray
            </span>
          </div>
          <p className="text-xs text-slate-400">
            This is the core of the X-Ray. What is the narrative you are telling yourself? Why does this choice feel appealing or necessary?
          </p>
          <textarea
            id="section-reasoning"
            value={reasoning}
            onChange={(e) => {
              setReasoning(e.target.value);
              if (errors.reasoning) setErrors({ ...errors, reasoning: undefined });
            }}
            rows={4}
            placeholder="e.g., I feel my growth has stagnated. I'm afraid if I don't take a startup risk now before starting a family, I'll regret it forever. I believe the founders have a winning formula and that the skills I learn will make me bulletproof even if the company fails..."
            className={`w-full px-4 py-3 rounded-lg bg-slate-950/80 border text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-2 transition-all ${
              errors.reasoning
                ? 'border-rose-500/70 focus:ring-rose-500/30'
                : 'border-slate-800 focus:border-cyan-500/60 focus:ring-cyan-500/20'
            }`}
          />
          {errors.reasoning && (
            <div className="flex items-center gap-1.5 text-xs text-rose-400 font-medium">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{errors.reasoning}</span>
            </div>
          )}
        </div>

        {/* SECTION 04 */}
        <div className="p-6 rounded-xl border border-slate-800/90 bg-slate-900/40 backdrop-blur-sm space-y-4">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-bold text-white font-mono uppercase tracking-wider">
              SECTION 04: What matters most to you?
            </label>
            <span className="text-[11px] font-mono text-slate-500">
              Value Anchors
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Select the priorities that matter most to you. We cross-reference these against your reasoning to detect hidden trade-offs.
          </p>

          <div className="flex flex-wrap gap-2 pt-1">
            {DEFAULT_PRIORITY_OPTIONS.map((priority) => {
              const isSelected = selectedPriorities.includes(priority);
              return (
                <button
                  key={priority}
                  type="button"
                  onClick={() => togglePriority(priority)}
                  className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${
                    isSelected
                      ? 'bg-cyan-500/20 text-cyan-200 border border-cyan-400/40 shadow-[0_0_10px_rgba(56,189,248,0.15)]'
                      : 'bg-slate-950/60 text-slate-400 border border-slate-800 hover:border-slate-700 hover:text-slate-300'
                  }`}
                >
                  {priority}
                </button>
              );
            })}
          </div>

          {selectedPriorities.includes('Other') && (
            <div className="pt-2">
              <input
                type="text"
                value={otherPriorityText}
                onChange={(e) => setOtherPriorityText(e.target.value)}
                placeholder="Specify your other priority (e.g. Autonomy, Creative Freedom, Spiritual peace)..."
                className="w-full px-3 py-2 rounded-lg bg-slate-950/80 border border-slate-800 text-xs text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-cyan-500"
              />
            </div>
          )}
        </div>

        {/* SECTION 05 */}
        <div className="p-6 rounded-xl border border-slate-800/90 bg-slate-900/40 backdrop-blur-sm space-y-3">
          <div className="flex items-center justify-between">
            <label htmlFor="section-concerns" className="block text-sm font-bold text-white font-mono uppercase tracking-wider">
              SECTION 05: What are you worried you might be missing?
            </label>
            <span className="text-[11px] font-mono text-slate-500">
              Optional Intuitive Doubts
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Is there a nagging whisper, fear, or unverified hunch you haven't fully voiced to yourself yet?
          </p>
          <textarea
            id="section-concerns"
            value={blindSpotConcerns}
            onChange={(e) => setBlindSpotConcerns(e.target.value)}
            rows={2}
            placeholder="e.g., I'm worried I'm running away from corporate bureaucracy rather than running toward something I actually love..."
            className="w-full px-4 py-3 rounded-lg bg-slate-950/80 border border-slate-800 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-cyan-500/60 focus:ring-2 focus:ring-cyan-500/20 transition-all"
          />
        </div>

        {/* Action Button & Footnote */}
        <div className="pt-4 flex flex-col items-center gap-3">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full sm:w-auto px-10 py-4 text-base font-bold text-slate-950 bg-gradient-to-r from-cyan-400 via-sky-300 to-cyan-400 hover:from-cyan-300 hover:to-sky-200 rounded-xl shadow-[0_0_30px_rgba(56,189,248,0.3)] transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60 disabled:pointer-events-none font-mono tracking-wider flex items-center justify-center gap-3"
          >
            <Layers className="w-5 h-5 text-slate-950" />
            <span>RUN DECISION X-RAY</span>
          </button>
          <div className="text-[11px] text-slate-500 font-mono flex items-center gap-2">
            <span>Press</span>
            <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300 text-[10px]">
              ⌘/Ctrl + Enter
            </kbd>
            <span>to trigger audit</span>
          </div>
        </div>
      </form>
    </div>
  );
};
