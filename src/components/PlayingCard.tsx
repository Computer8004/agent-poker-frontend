import type { Card } from '@/types';
import { SUIT_SYMBOLS, SUIT_COLORS, RANK_DISPLAY } from '@/types';

interface PlayingCardProps {
  card?: Card;
  hidden?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function PlayingCard({ card, hidden = false, size = 'md' }: PlayingCardProps) {
  const sizeClasses = {
    sm: 'w-10 h-14 text-sm',
    md: 'w-16 h-22 text-lg',
    lg: 'w-20 h-28 text-xl',
  };

  if (hidden || !card) {
    return (
      <div
        className={`${sizeClasses[size]} rounded-lg card-back flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform`}
      >
        <div className="w-3/4 h-3/4 rounded border border-blue-400/30 flex items-center justify-center">
          <div className="text-blue-400/50 text-2xl font-bold">?</div>
        </div>
      </div>
    );
  }

  const suitSymbol = SUIT_SYMBOLS[card.suit] || card.suit;
  const suitColor = SUIT_COLORS[card.suit] || 'text-slate-800';
  const rankDisplay = RANK_DISPLAY[card.rank] || card.rank;

  return (
    <div
      className={`${sizeClasses[size]} rounded-lg card-front flex flex-col items-center justify-between py-1 px-1 shadow-lg transform hover:scale-105 transition-transform`}
    >
      <div className={`font-bold ${suitColor} leading-none`}>{rankDisplay}</div>
      <div className={`text-2xl ${suitColor}`}>{suitSymbol}</div>
      <div className={`font-bold ${suitColor} leading-none rotate-180`}>{rankDisplay}</div>
    </div>
  );
}

interface CardHandProps {
  cards: Card[];
  hidden?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function CardHand({ cards, hidden = false, size = 'md', className = '' }: CardHandProps) {
  return (
    <div className={`flex gap-2 ${className}`}>
      {cards.map((card, index) => (
        <PlayingCard key={index} card={card} hidden={hidden} size={size} />
      ))}
    </div>
  );
}
