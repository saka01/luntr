export type CardType = 'mcq' | 'plan' | 'order' | 'fitb' | 'insight';

// ---- Prompts & Answers (discriminated unions) ----
export type McqPrompt = { type: 'mcq'; stem: string; options: string[] };
export type McqAnswer = { correctIndex: number; rationale: string };

export type PlanPrompt = { type: 'plan'; stem: string };
export type PlanAnswer = { checklist: string[]; rationale: string };

export type OrderPrompt = { type: 'order'; stem: string; steps: string[] };
export type OrderAnswer = { order: number[]; rationale: string };

export type FitbPrompt = { type: 'fitb'; stem: string; blanks: number };
export type FitbAnswer = { solutions: string[][]; rationale: string };

export type InsightPrompt = { type: 'insight'; stem: string };
export type InsightAnswer = { rationale: string };

export type AnyPrompt = McqPrompt | PlanPrompt | OrderPrompt | FitbPrompt | InsightPrompt;
export type AnyAnswer = McqAnswer | PlanAnswer | OrderAnswer | FitbAnswer | InsightAnswer;

// ---- Attempt payloads from UI ----
export type AttemptPayload =
  | { type: 'mcq'; choice: number }
  | { type: 'plan'; text: string }
  | { type: 'order'; order: number[] }
  | { type: 'fitb'; blanks: string[] }
  | { type: 'insight' }; // non-graded
