// Utility functions for working with the new card system

import { CardType } from './types';
import { defaultEstSeconds } from './timer';

export function getCardTimerSeconds(card: { type: CardType; estSeconds?: number }) {
  return card.estSeconds ?? defaultEstSeconds(card.type);
}

export function isGradedCardType(type: CardType): boolean {
  return type !== 'insight';
}

export function formatCardSubtype(subtype?: string): string {
  if (!subtype) return '';
  
  const subtypeMap: Record<string, string> = {
    'recognition': 'Recognition',
    'edge': 'Edge Case',
    'complexity': 'Complexity',
    'impl': 'Implementation'
  };
  
  return subtypeMap[subtype] || subtype;
}

export function parseCardTags(tags?: string): string[] {
  if (!tags) return [];
  try {
    return JSON.parse(tags);
  } catch {
    return [];
  }
}
