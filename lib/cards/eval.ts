import { AttemptPayload, McqAnswer, OrderAnswer, FitbAnswer, PlanAnswer } from './types';
import { evaluatePlan } from '../gemini';

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

export function evalFitb(answer: FitbAnswer, userAnswers: string[]) {
  if (userAnswers.length !== answer.solutions.length) 
    return { correct: false, perBlank: [] };
  
  const perBlank = userAnswers.map((userAnswer, i) => {
    if (!userAnswer.trim()) return false;
    
    const acceptedSolutions = answer.solutions[i] || [];
    return acceptedSolutions.some(solution => 
      solution.toLowerCase().trim() === userAnswer.toLowerCase().trim()
    );
  });
  
  return { 
    correct: perBlank.every(Boolean), 
    perBlank,
    feedback: { perBlank, solutions: answer.solutions }
  };
}

export async function evalPlan(answer: PlanAnswer, text: string) {
  try {
    const result = await evaluatePlan(answer.checklist, text);
    const correct = result.coverage >= 0.7; // threshold you can tune
    return { 
      correct, 
      feedback: { 
        coverage: result.coverage, 
        missing: result.missing,
        matched: result.matched
      } 
    };
  } catch (error) {
    console.error('Plan evaluation error:', error);
    // Fallback to local evaluation if Gemini fails
    const lines = text.split('\n').map(norm).filter(Boolean);
    const covered = answer.checklist.map(item => {
      const terms = norm(item).split(/\s+/).slice(0, 3).join(' '); // cheap token contain
      return lines.some(l => l.includes(terms));
    });
    const coverage = covered.filter(Boolean).length / answer.checklist.length;
    const missing = answer.checklist.filter((_, i) => !covered[i]);
    const correct = coverage >= 0.7;
    return { correct, feedback: { coverage, missing } };
  }
}

export async function evaluate(type: string, answer: any, payload: AttemptPayload) {
  if (type === 'mcq' && payload.type === 'mcq') return evalMcq(answer as McqAnswer, payload.choice);
  if (type === 'order' && payload.type === 'order') return evalOrder(answer as OrderAnswer, payload.order);
  if (type === 'fitb' && payload.type === 'fitb') return evalFitb(answer as FitbAnswer, payload.blanks);
  if (type === 'plan' && payload.type === 'plan') return await evalPlan(answer as PlanAnswer, payload.text);
  // insight: non-graded
  return { correct: null, feedback: {} };
}
