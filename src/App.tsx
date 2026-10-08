import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { LandingHero } from './components/LandingHero';
import { DecisionLab } from './components/DecisionLab';
import { ScanningState } from './components/ScanningState';
import { ReasoningXRayDashboard } from './components/ReasoningXRayDashboard';
import { ChallengeModal } from './components/ChallengeModal';
import { Footer } from './components/Footer';
import { XRayReport, DecisionPayload, ChallengeReport } from './types/xray';
import { SampleScenario } from './data/sampleScenarios';
import { AlertCircle, RefreshCw } from 'lucide-react';

export default function App() {
  const [currentView, setCurrentView] = useState<'landing' | 'lab' | 'results'>('landing');
  const [inputData, setInputData] = useState<DecisionPayload | null>(null);
  const [report, setReport] = useState<XRayReport | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Adversarial Challenge State
  const [challengeData, setChallengeData] = useState<ChallengeReport | null>(null);
  const [isChallenging, setIsChallenging] = useState(false);
  const [isChallengeModalOpen, setIsChallengeModalOpen] = useState(false);

  // Select Sample Scenario from Landing
  const handleSelectSample = (scenario: SampleScenario) => {
    setInputData({
      decision: scenario.decision,
      context: scenario.context,
      reasoning: scenario.reasoning,
      priorities: scenario.priorities,
      blindSpotConcerns: scenario.blindSpotConcerns,
    });
    setError(null);
    setCurrentView('lab');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Submit Decision from Lab to Gemini Backend
  const handleSubmitLab = async (payload: DecisionPayload) => {
    setInputData(payload);
    setIsLoading(true);
    setError(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    try {
      const response = await fetch('/api/xray', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate Decision X-Ray.');
      }

      if (!data.report) {
        throw new Error('Invalid analysis format received.');
      }

      setReport(data.report);
      setCurrentView('results');
    } catch (err: any) {
      console.error('Error during X-Ray execution:', err);
      setError(err.message || 'An unexpected error occurred during the reasoning scan.');
    } finally {
      setIsLoading(false);
    }
  };

  // Adversarial Challenge
  const handleChallengeReasoning = async () => {
    if (!inputData || !report) return;

    setIsChallenging(true);
    setIsChallengeModalOpen(true);

    try {
      const response = await fetch('/api/challenge', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          decision: inputData.decision,
          reasoning: inputData.reasoning,
          priorities: inputData.priorities,
          reportSummary: report.decision_summary,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to challenge reasoning.');
      }

      setChallengeData(data.challenge);
    } catch (err: any) {
      console.error('Challenge reasoning error:', err);
      // Let modal handle retry state
    } finally {
      setIsChallenging(false);
    }
  };

  const handleReset = () => {
    setReport(null);
    setInputData(null);
    setChallengeData(null);
    setError(null);
    setCurrentView('lab');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col font-sans selection:bg-cyan-500/20 selection:text-cyan-200">
      {/* Global Navigation */}
      <Navbar
        currentView={currentView}
        onNavigate={(view) => {
          setError(null);
          setCurrentView(view);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        hasActiveReport={!!report}
        onReset={handleReset}
      />

      {/* Global Error Banner */}
      {error && (
        <div className="max-w-4xl mx-auto px-4 mt-6 w-full">
          <div className="p-4 rounded-xl border border-rose-800/60 bg-rose-950/40 text-rose-200 flex items-start justify-between gap-3 text-sm">
            <div className="flex items-start gap-2.5">
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-rose-300">Analysis Error</p>
                <p className="text-xs text-rose-200/90 mt-0.5">{error}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {inputData && (
                <button
                  onClick={() => handleSubmitLab(inputData)}
                  className="px-3 py-1 text-xs font-mono bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded transition-colors flex items-center gap-1.5"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Retry Analysis</span>
                </button>
              )}
              <button
                onClick={() => setError(null)}
                className="px-2.5 py-1 text-xs font-mono bg-rose-900/60 hover:bg-rose-800 text-rose-200 rounded border border-rose-700/60 transition-colors"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main View Router */}
      <main className="flex-1">
        {isLoading ? (
          <ScanningState />
        ) : (
          <>
            {currentView === 'landing' && (
              <LandingHero
                onStart={() => {
                  setError(null);
                  setCurrentView('lab');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onSelectSample={handleSelectSample}
              />
            )}

            {currentView === 'lab' && (
              <DecisionLab
                initialData={inputData || undefined}
                onSubmit={handleSubmitLab}
                isLoading={isLoading}
                onBack={() => {
                  setError(null);
                  setCurrentView('landing');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            )}

            {currentView === 'results' && report && inputData && (
              <ReasoningXRayDashboard
                report={report}
                inputData={inputData}
                onChallenge={handleChallengeReasoning}
                isChallenging={isChallenging}
                onNewDecision={handleReset}
                onEditInputs={() => {
                  setError(null);
                  setCurrentView('lab');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            )}
          </>
        )}
      </main>

      {/* Adversarial Challenge Modal */}
      <ChallengeModal
        isOpen={isChallengeModalOpen}
        onClose={() => setIsChallengeModalOpen(false)}
        isLoading={isChallenging}
        challengeData={challengeData}
        onRetry={handleChallengeReasoning}
      />

      {/* Subtle Clinical Footer */}
      <Footer />
    </div>
  );
}
