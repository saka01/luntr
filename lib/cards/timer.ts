import { CardType } from '@/lib/cards/types';

export function defaultEstSeconds(cardType: CardType) {
  switch (cardType) {
    case 'mcq': return 60;
    case 'fitb': return 75;
    case 'order': return 90;
    case 'plan': return 120;
    case 'insight': return 0;
  }
}
