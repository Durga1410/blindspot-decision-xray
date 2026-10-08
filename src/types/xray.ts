export type EvidenceLevel = 'USER-STATED' | 'INFERRED' | 'HYPOTHESIS TO VERIFY';

export interface ConsideredFactor {
  factor: string;
  source: 'user_stated' | 'user_implied';
  evidence_level: EvidenceLevel;
  source_quote?: string;
}

export interface HiddenAssumption {
  assumption: string;
  evidence_level: EvidenceLevel;
  reasoning_evidence: string;
  why_it_matters: string;
  confidence: 'low' | 'medium' | 'high';
  how_to_verify: string;
  traceability_why: string;
}

export interface BlindSpot {
  factor: string;
  evidence_level: EvidenceLevel;
  why_it_may_be_overlooked: string;
  why_it_matters: string;
  evidence_to_seek: string;
  traceability_why: string;
}

export interface ReasoningTension {
  stated_priority: string;
  reasoning_pattern: string;
  potential_tension: string;
  evidence_level: EvidenceLevel;
  traceability_why: string;
}

export interface AlternativePerspective {
  perspective: string;
  what_it_highlights: string;
  evidence_level?: EvidenceLevel;
}

export interface EvidenceGap {
  unknown: string;
  evidence_level: EvidenceLevel;
  why_it_matters: string;
  how_to_verify: string;
}

export interface StressTestItem {
  assumption: string;
  evidence_level: EvidenceLevel;
  what_would_make_it_wrong: string;
  evidence_that_would_help: string;
}

export interface XRayReport {
  decision_summary: string;
  considered_factors: ConsideredFactor[];
  hidden_assumptions: HiddenAssumption[];
  blind_spots: BlindSpot[];
  reasoning_tensions: ReasoningTension[];
  alternative_perspectives: AlternativePerspective[];
  evidence_gaps: EvidenceGap[];
  questions_to_explore: string[];
  stress_test: StressTestItem[];
  reflection_prompt: string;
}

export interface ChallengeReport {
  strongest_assumption: string;
  strongest_assumption_level: EvidenceLevel;
  evidence_supporting_it: string;
  evidence_missing: string;
  what_could_make_it_wrong: string;
  counter_perspective: string;
  counter_perspective_level: EvidenceLevel;
  questions_to_investigate: string[];
}

export interface DecisionPayload {
  decision: string;
  context: string;
  reasoning: string;
  priorities: string[];
  blindSpotConcerns?: string;
}
