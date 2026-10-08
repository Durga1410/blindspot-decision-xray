import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isProduction = process.env.NODE_ENV === 'production';
const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.json({ limit: '1mb' }));

// Shared Gemini Client instance
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// JSON Schema for X-Ray Analysis
const xrayResponseSchema = {
  type: Type.OBJECT,
  properties: {
    decision_summary: {
      type: Type.STRING,
      description: "Concise objective synthesis of the user's impending decision and situation.",
    },
    considered_factors: {
      type: Type.ARRAY,
      description: "List of factors the user explicitly stated or weighed.",
      items: {
        type: Type.OBJECT,
        properties: {
          factor: { type: Type.STRING, description: "The specific factor or consideration." },
          source: { type: Type.STRING, description: "Must be 'user_stated' or 'user_implied'." },
          evidence_level: { type: Type.STRING, description: "Must be 'USER-STATED'." },
          source_quote: { type: Type.STRING, description: "Direct brief quote or phrase from the user input that contains this factor." },
        },
        required: ["factor", "source", "evidence_level"],
      },
    },
    hidden_assumptions: {
      type: Type.ARRAY,
      description: "Unstated beliefs or premises the user is taking for granted without sufficient verification. Use careful phrases like 'may assume', 'appears to assume', or 'worth examining'.",
      items: {
        type: Type.OBJECT,
        properties: {
          assumption: { type: Type.STRING, description: "The unstated assumption (e.g. 'Your reasoning appears to assume that...')." },
          evidence_level: { type: Type.STRING, description: "Must be either 'INFERRED' or 'HYPOTHESIS TO VERIFY'." },
          reasoning_evidence: { type: Type.STRING, description: "Where in the user's reasoning this assumption stems from." },
          why_it_matters: { type: Type.STRING, description: "How this assumption influences the evaluation." },
          confidence: { type: Type.STRING, description: "'low', 'medium', or 'high' likelihood that this is an unverified assumption." },
          how_to_verify: { type: Type.STRING, description: "Concrete, actionable way to verify or test this assumption." },
          traceability_why: { type: Type.STRING, description: "Explanation of why BlindSpot identified this, referencing user input and what was missing." },
        },
        required: ["assumption", "evidence_level", "reasoning_evidence", "why_it_matters", "confidence", "how_to_verify", "traceability_why"],
      },
    },
    blind_spots: {
      type: Type.ARRAY,
      description: "Important external factors, second-order effects, or risks completely overlooked in the reasoning.",
      items: {
        type: Type.OBJECT,
        properties: {
          factor: { type: Type.STRING, description: "The overlooked variable or second-order factor." },
          evidence_level: { type: Type.STRING, description: "Must be 'HYPOTHESIS TO VERIFY' or 'INFERRED'." },
          why_it_may_be_overlooked: { type: Type.STRING, description: "Cognitive or situational reason this was missing." },
          why_it_matters: { type: Type.STRING, description: "The potential impact on outcomes." },
          evidence_to_seek: { type: Type.STRING, description: "Concrete information or metric the user should look for." },
          traceability_why: { type: Type.STRING, description: "Explanation of why BlindSpot identified this, referencing what was missing from the user's stated logic." },
        },
        required: ["factor", "evidence_level", "why_it_may_be_overlooked", "why_it_matters", "evidence_to_seek", "traceability_why"],
      },
    },
    reasoning_tensions: {
      type: Type.ARRAY,
      description: "Contradictions, trade-offs, or misalignments between the user's stated priorities and actual reasoning path.",
      items: {
        type: Type.OBJECT,
        properties: {
          stated_priority: { type: Type.STRING, description: "What the user says matters most (e.g. Career growth, Learning, Stability)." },
          reasoning_pattern: { type: Type.STRING, description: "How their actual logic seems to favor something else." },
          potential_tension: { type: Type.STRING, description: "The respectful, objective identification of the tension (use words like 'may', 'appears', 'worth examining')." },
          evidence_level: { type: Type.STRING, description: "Must be 'INFERRED' or 'HYPOTHESIS TO VERIFY'." },
          traceability_why: { type: Type.STRING, description: "Direct explanation comparing what they checked as priority vs what their reasoning focused on." },
        },
        required: ["stated_priority", "reasoning_pattern", "potential_tension", "evidence_level", "traceability_why"],
      },
    },
    alternative_perspectives: {
      type: Type.ARRAY,
      description: "Exactly 3 distinct angles (Short-term perspective, Long-term perspective, and a Different stakeholder perspective).",
      items: {
        type: Type.OBJECT,
        properties: {
          perspective: { type: Type.STRING, description: "Name of the viewpoint or lens." },
          what_it_highlights: { type: Type.STRING, description: "What this viewpoint notices that current reasoning de-emphasizes." },
          evidence_level: { type: Type.STRING, description: "Must be 'INFERRED' or 'HYPOTHESIS TO VERIFY'." },
        },
        required: ["perspective", "what_it_highlights"],
      },
    },
    evidence_gaps: {
      type: Type.ARRAY,
      description: "Crucial empirical facts or unknowns that have not yet been established.",
      items: {
        type: Type.OBJECT,
        properties: {
          unknown: { type: Type.STRING, description: "The specific missing data or unknown condition." },
          evidence_level: { type: Type.STRING, description: "Must be 'HYPOTHESIS TO VERIFY'." },
          why_it_matters: { type: Type.STRING, description: "Why making the decision without this fact increases vulnerability." },
          how_to_verify: { type: Type.STRING, description: "Actionable way to test or discover this data." },
        },
        required: ["unknown", "evidence_level", "why_it_matters", "how_to_verify"],
      },
    },
    questions_to_explore: {
      type: Type.ARRAY,
      description: "5-7 deeply probing, non-judgmental questions designed to expand the user's mental map.",
      items: {
        type: Type.STRING,
      },
    },
    stress_test: {
      type: Type.ARRAY,
      description: "Inversion testing: what conditions or counter-evidence would prove an underlying assumption false? NEVER introduce unprovided specific numerical values, workloads (e.g. do NOT say '70-hour workweek' if not in input), relationships, health conditions, or concrete facts not present in user input. Phrase hypotheticals generically (e.g. 'if the total workload becomes substantially higher than expected') and classify as 'HYPOTHESIS TO VERIFY'.",
      items: {
        type: Type.OBJECT,
        properties: {
          assumption: { type: Type.STRING, description: "The underlying assumption tested." },
          evidence_level: { type: Type.STRING, description: "Must be 'INFERRED' or 'HYPOTHESIS TO VERIFY'." },
          what_would_make_it_wrong: { type: Type.STRING, description: "The generic real-world trigger or condition that invalidates it without inventing unstated facts." },
          evidence_that_would_help: { type: Type.STRING, description: "Leading indicator to monitor." },
        },
        required: ["assumption", "evidence_level", "what_would_make_it_wrong", "evidence_that_would_help"],
      },
    },
    reflection_prompt: {
      type: Type.STRING,
      description: "A tailored prompt encouraging the user to integrate these insights into their own decision-making.",
    },
  },
  required: [
    "decision_summary",
    "considered_factors",
    "hidden_assumptions",
    "blind_spots",
    "reasoning_tensions",
    "alternative_perspectives",
    "evidence_gaps",
    "questions_to_explore",
    "stress_test",
    "reflection_prompt",
  ],
};

// Helper to generate content with retry & fallback on transient 503/429
async function generateWithRetry(contents: string, config: any) {
  const modelsToTry = ['gemini-3.8-flash', 'gemini-3.1-flash-lite', 'gemini-flash-latest'];
  let lastError: any = null;

  for (const model of modelsToTry) {
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents,
          config,
        });
        if (response && response.text) {
          return response;
        }
      } catch (err: any) {
        lastError = err;
        const msg = err?.message || '';
        const isTransient = msg.includes('503') || msg.includes('high demand') || msg.includes('UNAVAILABLE') || msg.includes('429');
        if (isTransient) {
          // If 503 high demand on gemini-3.8-flash, break out to next model immediately
          break;
        } else {
          throw err;
        }
      }
    }
  }

  throw lastError;
}
const challengeResponseSchema = {
  type: Type.OBJECT,
  properties: {
    strongest_assumption: {
      type: Type.STRING,
      description: "The single most pivotal assumption supporting the user's favored direction.",
    },
    strongest_assumption_level: {
      type: Type.STRING,
      description: "Evidence level: 'INFERRED' or 'HYPOTHESIS TO VERIFY'.",
    },
    evidence_supporting_it: {
      type: Type.STRING,
      description: "What specific statements or rationale in the user's input currently support or suggest this assumption.",
    },
    evidence_missing: {
      type: Type.STRING,
      description: "What objective empirical facts or validations are completely absent from the user's input.",
    },
    what_could_make_it_wrong: {
      type: Type.STRING,
      description: "Specific real-world conditions, market shifts, or failure modes that would invalidate this assumption.",
    },
    counter_perspective: {
      type: Type.STRING,
      description: "The strongest counter-perspective or Devil's Advocate viewpoint on this decision.",
    },
    counter_perspective_level: {
      type: Type.STRING,
      description: "Evidence level: 'INFERRED' or 'HYPOTHESIS TO VERIFY'.",
    },
    questions_to_investigate: {
      type: Type.ARRAY,
      description: "Exactly 3 sharp questions to pressure-test this reasoning.",
      items: {
        type: Type.STRING,
      },
    },
  },
  required: [
    "strongest_assumption",
    "strongest_assumption_level",
    "evidence_supporting_it",
    "evidence_missing",
    "what_could_make_it_wrong",
    "counter_perspective",
    "counter_perspective_level",
    "questions_to_investigate",
  ],
};

// API: Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    hasApiKey: !!process.env.GEMINI_API_KEY,
  });
});

// API: Run Decision X-Ray
app.post('/api/xray', async (req, res) => {
  try {
    const { decision, context, reasoning, priorities, blindSpotConcerns } = req.body;

    if (!decision || typeof decision !== 'string' || !decision.trim()) {
      return res.status(400).json({ error: 'Please provide the decision you are considering.' });
    }
    if (!reasoning || typeof reasoning !== 'string' || !reasoning.trim()) {
      return res.status(400).json({ error: 'Please share your reasoning for why you are leaning this way.' });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        error: 'Gemini API key is not configured. Please ensure GEMINI_API_KEY is set in secrets.',
      });
    }

    const sanitizedDecision = decision.slice(0, 1500);
    const sanitizedContext = (context || '').slice(0, 3000);
    const sanitizedReasoning = reasoning.slice(0, 3000);
    const sanitizedPriorities = Array.isArray(priorities) ? priorities.slice(0, 10).join(', ') : 'Not specified';
    const sanitizedBlindSpotConcerns = (blindSpotConcerns || '').slice(0, 1500);

    const prompt = `You are BLINDSPOT — the Decision X-Ray cognitive reasoning engine.
Your purpose is to analyze the USER'S REASONING, not to make the decision for them.

CRITICAL DIRECTIVES & ANTI-HALLUCINATION RULES:
1. ABSOLUTE RULE: NEVER tell the user what they should choose, which option is best, whether they should accept or reject anything, or what I recommend.
2. NEVER calculate or output a numerical probability of success, confidence score, or chance of correctness.
3. ANTI-HALLUCINATION MANDATE (CONCRETE FACTS & NUMERICAL VALUES):
   When generating insights, blind spots, or stress tests, NEVER introduce a specific numerical value, personal circumstance, workload, health condition, financial condition, relationship, or other concrete fact that was not present in the user's input.
   For example, if the user states "9 AM to 6 PM", do NOT transform this into "70-hour workweek" or "80 hours" unless the user explicitly provided that information.
   If the user did not explicitly mention spouse/partner, children, health conditions, financial obligations, family situation, specific work hours, specific company conditions, or specific people, DO NOT present these as facts.
   If a hypothetical scenario is useful, phrase it generically:
   e.g. "if the total workload becomes substantially higher than expected" or "if financial requirements exceed reserves"
   and label it:
   [HYPOTHESIS TO VERIFY].
4. EVIDENCE CLASSIFICATION: Every single concrete claim must be:
   - "USER-STATED": The user explicitly provided this information.
   - "INFERRED": The insight is reasonably inferred from information explicitly provided by the user.
   - "HYPOTHESIS TO VERIFY": The AI believes this could be relevant, but the user's input does not provide enough evidence to establish it.
5. SOURCE TRACEABILITY: For every hidden assumption, blind spot, and reasoning tension, provide "traceability_why" explaining "Why did BlindSpot identify this?" explicitly linking what the user wrote and what was missing or unverified.
6. For REASONING TENSIONS:
   - You say this matters: [stated priority]
   - Your reasoning emphasizes: [reasoning pattern]
   - Potential tension: [e.g., "The factors currently emphasized may not fully establish the career-growth outcome you value"].
   - Do NOT call the user inconsistent. Do NOT judge them. Do NOT tell them which factor should matter more.
7. For ALTERNATIVE PERSPECTIVES: Provide exactly 3 distinct perspectives (Short-term perspective, Long-term perspective, and a Different stakeholder perspective).
8. For QUESTIONS WORTH EXPLORING: Generate 5 to 7 high-quality, probing questions specific to this exact decision. Avoid generic questions like "What are the pros and cons?".
9. For STRESS TEST ("WHAT WOULD HAVE TO BE TRUE FOR YOUR REASONING TO BE WRONG?"):
   Identify 2 to 4 important assumptions. In "what_would_make_it_wrong", NEVER introduce unprovided specific numbers (e.g. hours, dollars) or unmentioned personal/family situations. Phrase hypotheticals generically (e.g. "if the total workload becomes substantially higher than expected") and classify as "HYPOTHESIS TO VERIFY".
10. The user is the autonomous decision maker. Your role is solely to shine an X-Ray light onto their blind spots, hidden assumptions, reasoning tensions, and missing empirical evidence.

USER INPUT:
- DECISION BEING WEIGHED:
${sanitizedDecision}

- FACTS, CONTEXT, CONSTRAINTS & ALTERNATIVES:
${sanitizedContext || 'None explicitly provided.'}

- USER'S REASONING (Why they lean this way):
${sanitizedReasoning}

- USER'S STATED PRIORITIES:
${sanitizedPriorities}

- USER'S INTUITIVE WORRIES (What they fear they might be missing):
${sanitizedBlindSpotConcerns || 'None provided.'}

TASK:
Produce an exhaustive, penetrating Decision X-Ray adhering strictly to the JSON schema. Ensure all insights have exact evidence_level tags and traceability explanations.`;

    const response = await generateWithRetry(prompt, {
      responseMimeType: 'application/json',
      responseSchema: xrayResponseSchema,
      systemInstruction:
        'You are BLINDSPOT, an objective cognitive diagnostic system. You strictly analyze reasoning quality, unstated assumptions, and cognitive blind spots. You never decide for the user, never rank options, and never invent unmentioned personal circumstances. Every insight must have an evidence_level ("USER-STATED", "INFERRED", or "HYPOTHESIS TO VERIFY") and a traceability explanation.',
    });

    const text = response.text;
    if (!text) {
      throw new Error('Empty response received from Gemini engine.');
    }

    let parsedReport: any;
    try {
      parsedReport = JSON.parse(text);
    } catch (parseErr) {
      const cleanJson = text.replace(/^```json\s*/, '').replace(/\s*```$/, '').trim();
      parsedReport = JSON.parse(cleanJson);
    }

    // Safety Normalization & Fallbacks
    if (!parsedReport || typeof parsedReport !== 'object') {
      throw new Error('Malformed analysis payload structure.');
    }

    parsedReport.considered_factors = Array.isArray(parsedReport.considered_factors)
      ? parsedReport.considered_factors.map((f: any) => ({
          factor: f.factor || 'Explicit consideration identified',
          source: f.source || 'user_stated',
          evidence_level: 'USER-STATED',
          source_quote: f.source_quote || f.factor || '',
        }))
      : [];

    parsedReport.hidden_assumptions = Array.isArray(parsedReport.hidden_assumptions)
      ? parsedReport.hidden_assumptions.map((a: any) => ({
          assumption: a.assumption || 'Unstated premise identified in logic',
          evidence_level: a.evidence_level === 'HYPOTHESIS TO VERIFY' ? 'HYPOTHESIS TO VERIFY' : 'INFERRED',
          reasoning_evidence: a.reasoning_evidence || 'Deduced from argument flow',
          why_it_matters: a.why_it_matters || 'Influences weight placed on options',
          confidence: a.confidence || 'medium',
          how_to_verify: a.how_to_verify || 'Seek empirical confirmation with domain peers or metrics',
          traceability_why: a.traceability_why || `Identified from your reasoning emphasis on: "${(a.reasoning_evidence || a.assumption).slice(0, 100)}"`,
        }))
      : [];

    parsedReport.blind_spots = Array.isArray(parsedReport.blind_spots)
      ? parsedReport.blind_spots.map((b: any) => ({
          factor: b.factor || 'Overlooked variable or downstream effect',
          evidence_level: b.evidence_level === 'INFERRED' ? 'INFERRED' : 'HYPOTHESIS TO VERIFY',
          why_it_may_be_overlooked: b.why_it_may_be_overlooked || 'Not explicitly modeled in submitted context',
          why_it_matters: b.why_it_matters || 'Could materially alter expected outcomes',
          evidence_to_seek: b.evidence_to_seek || 'Investigate empirical benchmarks or stakeholder inputs',
          traceability_why: b.traceability_why || 'Identified because this factor was not accounted for in your explicit parameters.',
        }))
      : [];

    parsedReport.reasoning_tensions = Array.isArray(parsedReport.reasoning_tensions)
      ? parsedReport.reasoning_tensions.map((t: any) => ({
          stated_priority: t.stated_priority || 'Stated Priority',
          reasoning_pattern: t.reasoning_pattern || 'Reasoning Pattern',
          potential_tension: t.potential_tension || 'The factors currently emphasized may not fully establish the outcome you value.',
          evidence_level: t.evidence_level === 'HYPOTHESIS TO VERIFY' ? 'HYPOTHESIS TO VERIFY' : 'INFERRED',
          traceability_why: t.traceability_why || `Identified by contrasting stated priority (${t.stated_priority}) against the focus of your rationale.`,
        }))
      : [];

    parsedReport.alternative_perspectives = Array.isArray(parsedReport.alternative_perspectives)
      ? parsedReport.alternative_perspectives.map((p: any) => ({
          perspective: p.perspective || 'Alternative View',
          what_it_highlights: p.what_it_highlights || '',
          evidence_level: p.evidence_level === 'USER-STATED' ? 'USER-STATED' : 'INFERRED',
        }))
      : [];

    parsedReport.evidence_gaps = Array.isArray(parsedReport.evidence_gaps)
      ? parsedReport.evidence_gaps.map((g: any) => ({
          unknown: g.unknown || 'Unknown parameter',
          evidence_level: 'HYPOTHESIS TO VERIFY',
          why_it_matters: g.why_it_matters || 'Reduces uncertainty in evaluation',
          how_to_verify: g.how_to_verify || 'Gather empirical data before committing',
        }))
      : [];

    parsedReport.questions_to_explore = Array.isArray(parsedReport.questions_to_explore) ? parsedReport.questions_to_explore : [];
    parsedReport.stress_test = Array.isArray(parsedReport.stress_test)
      ? parsedReport.stress_test.map((s: any) => ({
          assumption: s.assumption || '',
          evidence_level: s.evidence_level === 'HYPOTHESIS TO VERIFY' ? 'HYPOTHESIS TO VERIFY' : 'INFERRED',
          what_would_make_it_wrong: s.what_would_make_it_wrong || '',
          evidence_that_would_help: s.evidence_that_would_help || '',
        }))
      : [];

    parsedReport.decision_summary = parsedReport.decision_summary || sanitizedDecision;
    parsedReport.reflection_prompt = parsedReport.reflection_prompt || 'Did this analysis reveal anything you had not previously considered?';

    return res.json({ report: parsedReport });
  } catch (err: any) {
    console.error('Error generating X-Ray analysis:', err);
    return res.status(500).json({
      error: 'Failed to process Decision X-Ray. Please check your inputs and try again.',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined,
    });
  }
});

// API: Challenge My Reasoning (Adversarial Second-Level Stress Test)
app.post('/api/challenge', async (req, res) => {
  try {
    const { decision, reasoning, priorities, reportSummary } = req.body;

    if (!decision || !reasoning) {
      return res.status(400).json({ error: 'Missing decision context for challenge.' });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        error: 'Gemini API key is not configured.',
      });
    }

    const prompt = `You are the Adversarial Stress-Test Module of BLINDSPOT.
Your role is to rigorously challenge the user's current line of reasoning WITHOUT telling them what decision to make.
Do NOT repeat the general X-Ray report. Instead, act like an adversarial reasoning reviewer.

CRITICAL DIRECTIVES & ANTI-HALLUCINATION:
1. Challenge the REASONING, NOT the user. Never use insulting, judgmental, or absolute language.
2. NEVER invent personal circumstances, unmentioned people, or unprovided specific numerical values (e.g. do not invent hours, percentages, or dollar amounts not in input).
3. If a hypothetical scenario or failure condition is useful, phrase it generically (e.g., "if the total workload becomes substantially higher than expected") and classify as HYPOTHESIS TO VERIFY.
4. Every concrete claim must be:
   - USER-STATED, or
   - clearly INFERRED, or
   - clearly HYPOTHESIS TO VERIFY.
5. Structure the output strictly into:
   - strongest_assumption: The single most pivotal load-bearing assumption supporting their favored direction.
   - strongest_assumption_level: "INFERRED" or "HYPOTHESIS TO VERIFY"
   - evidence_supporting_it: What specific evidence or statements in the user's input currently support it.
   - evidence_missing: What crucial objective evidence or validation is absent.
   - what_could_make_it_wrong: What realistic real-world conditions or failure modes would dismantle it (phrased generically without inventing numbers or unmentioned circumstances).
   - counter_perspective: The strongest credible counter-argument or Devil's Advocate viewpoint.
   - counter_perspective_level: "INFERRED" or "HYPOTHESIS TO VERIFY"
   - questions_to_investigate: Exactly 3 razor-sharp questions to investigate.
6. Absolutely NO recommendations on which choice is "right" or "better". The user stays in command.

DECISION UNDER CONSIDERATION:
${decision.slice(0, 1500)}

USER'S REASONING:
${reasoning.slice(0, 2000)}

STATED PRIORITIES:
${Array.isArray(priorities) ? priorities.join(', ') : 'Not specified'}

EXISTING X-RAY CONTEXT:
${typeof reportSummary === 'string' ? reportSummary.slice(0, 1500) : ''}`;

    const response = await generateWithRetry(prompt, {
      responseMimeType: 'application/json',
      responseSchema: challengeResponseSchema,
      systemInstruction:
        'You are an adversarial cognitive reviewer. You challenge the logic, assumptions, and missing evidence with clinical rigor, without attacking or judging the user, and without making decisions. Every claim must have an evidence classification.',
    });

    const text = response.text;
    if (!text) {
      throw new Error('Empty response received from challenge engine.');
    }

    let parsedChallenge: any;
    try {
      parsedChallenge = JSON.parse(text);
    } catch (parseErr) {
      const cleanJson = text.replace(/^```json\s*/, '').replace(/\s*```$/, '').trim();
      parsedChallenge = JSON.parse(cleanJson);
    }

    if (!parsedChallenge || typeof parsedChallenge !== 'object') {
      throw new Error('Malformed challenge payload structure.');
    }

    // Safety fallback
    parsedChallenge.strongest_assumption_level = parsedChallenge.strongest_assumption_level || 'INFERRED';
    parsedChallenge.counter_perspective_level = parsedChallenge.counter_perspective_level || 'HYPOTHESIS TO VERIFY';
    parsedChallenge.questions_to_investigate = Array.isArray(parsedChallenge.questions_to_investigate)
      ? parsedChallenge.questions_to_investigate.slice(0, 3)
      : [];

    return res.json({ challenge: parsedChallenge });
  } catch (err: any) {
    console.error('Error generating challenge:', err);
    return res.status(500).json({
      error: 'Failed to generate adversarial challenge. Please try again.',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined,
    });
  }
});

// Serve frontend in dev or prod
async function startServer() {
  if (!isProduction) {
    const vite = await (
      await import('vite')
    ).createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`BLINDSPOT server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
