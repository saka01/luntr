import { AttemptPayload, McqAnswer, OrderAnswer, FitbAnswer, PlanAnswer } from './types';

const norm = (s: string) => s.trim().toLowerCase();

export function evalMcq(answer: McqAnswer, choice: number) {
  const correct = choice === answer.correctIndex;
  return { correct, feedback: { correctIndex: answer.correctIndex } };
}

export function evalOrder(answer: OrderAnswer, order: number[]) {
  const correct = JSON.stringify(order) === JSON.stringify(answer.order);
  let firstMismatch: number | null = null;
  if (!correct) {
    for (let i = 0; i < order.length; i++) {
      if (order[i] !== answer.order[i]) {
        firstMismatch = i;
        break;
      }
    }
  }
  return { correct, feedback: { firstMismatch } };
}

export function evalFitb(answer: FitbAnswer, blanks: string[]) {
  const ok = blanks.map((b, i) => (answer.solutions[i] || []).map(norm).includes(norm(b)));
  const correct = ok.every(Boolean);
  return { correct, feedback: { ok, accepted: answer.solutions } };
}

export function evalPlan(answer: PlanAnswer, text: string) {
  const lines = text.split('\n').map(norm).filter(Boolean);
  const covered = answer.checklist.map(item => {
    const terms = norm(item).split(/\s+/).slice(0, 3).join(' '); // cheap token contain
    return lines.some(l => l.includes(terms));
  });
  const coverage = covered.filter(Boolean).length / answer.checklist.length;
  const missing = answer.checklist.filter((_, i) => !covered[i]);
  const correct = coverage >= 0.7; // threshold you can tune
  return { correct, feedback: { coverage, missing } };
}

export function evaluate(type: string, answer: any, payload: AttemptPayload) {
  if (type === 'mcq' && payload.type === 'mcq') return evalMcq(answer as McqAnswer, payload.choice);
  if (type === 'order' && payload.type === 'order') return evalOrder(answer as OrderAnswer, payload.order);
  if (type === 'fitb' && payload.type === 'fitb') return evalFitb(answer as FitbAnswer, payload.blanks);
  if (type === 'plan' && payload.type === 'plan') return evalPlan(answer as PlanAnswer, payload.text);
  // insight: non-graded
  return { correct: null, feedback: {} };
}
