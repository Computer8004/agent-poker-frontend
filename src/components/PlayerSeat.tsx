import type { Player } from '@/types';
import { CardHand } from './PlayingCard';
import { Bot, User, Crown } from 'lucide-react';

interface PlayerSeatProps {
  player: Player;
  isCurrentPlayer: boolean;
  isCurrentTurn: boolean;
  position: 'top' | 'topLeft' | 'topRight' | 'left' | 'right' | 'bottomLeft' | 'bottomRight' | 'bottom';
  isDealer: boolean;
}

export function PlayerSeat({ player, isCurrentPlayer, isCurrentTurn, position, isDealer }: PlayerSeatProps) {
  const positionClasses = {
    top: 'absolute top-4 left-1/2 -translate-x-1/2',
    topLeft: 'absolute top-16 left-16',
    topRight: 'absolute top-16 right-16',
    left: 'absolute top-1/2 left-4 -translate-y-1/2',
    right: 'absolute top-1/2 right-4 -translate-y-1/2',
    bottomLeft: 'absolute bottom-16 left-16',
    bottomRight: 'absolute bottom-16 right-16',
    bottom: 'absolute bottom-4 left-1/2 -translate-x-1/2',
  };

  // Check if player is a bot (no real address)
  const isBot = player.address.startsWith('0x0000') || player.name.toLowerCase().includes('bot');

  return (
    <div className={`${positionClasses[position]} flex flex-col items-center gap-2`}>
      <div
        className={`
          relative px-4 py-2 rounded-lg border-2 transition-all duration-300
          ${isCurrentTurn ? 'border-primary agent-glow bg-primary/10' : 'border-border bg-card/80'}
          ${player.hasFolded ? 'opacity-50' : 'opacity-100'}
        `}
      >
        {isDealer && (
          <div className="absolute -top-3 -right-3 w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center text-xs font-bold text-black">
            D
          </div>
        )}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
            {isBot ? (
              <Bot className="w-4 h-4 text-muted-foreground" />
            ) : (
              <User className="w-4 h-4 text-primary" />
            )}
          </div>
          <div className="text-left">
            <div className="font-semibold text-sm flex items-center gap-1">
              {player.name}
              {isCurrentPlayer && <Crown className="w-3 h-3 text-yellow-500" />}
            </div>
            <div className="text-xs text-muted-foreground">
              {player.chips.toLocaleString()} chips
            </div>
          </div>
        </div>
        
        {player.currentBet > 0 && (
          <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-yellow-500/90 text-black text-xs font-bold px-2 py-1 rounded-full">
            {player.currentBet.toLocaleString()}
          </div>
        )}
      </div>

      {isCurrentPlayer && player.holeCards && (
        <CardHand cards={player.holeCards} size="sm" />
      )}
      
      {!isCurrentPlayer && player.holeCards && (
        <CardHand cards={player.holeCards} hidden size="sm" />
      )}
    </div>
  );
}
