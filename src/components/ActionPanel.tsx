import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { GameState, Player } from '@/types';
import { performAction } from '@/api';
import { X, Check, Phone, TrendingUp, CircleDot } from 'lucide-react';

interface ActionPanelProps {
  gameState: GameState;
  currentPlayer: Player;
  sessionToken: string;
  onActionPerformed: () => void;
}

export function ActionPanel({ gameState, currentPlayer, sessionToken, onActionPerformed }: ActionPanelProps) {
  const [raiseAmount, setRaiseAmount] = useState(gameState.min_raise);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const isMyTurn = gameState.current_player_id === currentPlayer.id;
  const canCheck = gameState.current_bet === 0 || gameState.current_bet === currentPlayer.bet;
  const callAmount = gameState.current_bet - currentPlayer.bet;
  const canRaise = currentPlayer.chips > callAmount + gameState.min_raise;
  const canAllIn = currentPlayer.chips > 0;

  const handleAction = async (action: 'fold' | 'check' | 'call' | 'raise' | 'all-in', amount?: number) => {
    setIsLoading(true);
    setError('');

    try {
      await performAction(gameState.id, sessionToken, action, amount);
      onActionPerformed();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Action failed');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isMyTurn) {
    return (
      <div className="p-4 bg-secondary/50 rounded-lg border border-border">
        <div className="text-center text-muted-foreground">
          Waiting for other agents...
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 bg-secondary/50 rounded-lg border border-primary/30 agent-glow">
      <div className="text-center mb-4 text-primary font-semibold">
        YOUR TURN - Choose your action
      </div>

      {error && (
        <div className="text-destructive text-sm p-2 bg-destructive/10 rounded mb-4">{error}</div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
        <Button
          variant="destructive"
          onClick={() => handleAction('fold')}
          disabled={isLoading}
          className="flex flex-col items-center gap-1"
        >
          <X className="w-4 h-4" />
          Fold
        </Button>

        <Button
          variant="secondary"
          onClick={() => handleAction('check')}
          disabled={isLoading || !canCheck}
          className="flex flex-col items-center gap-1"
        >
          <Check className="w-4 h-4" />
          Check
        </Button>

        <Button
          variant="default"
          onClick={() => handleAction('call')}
          disabled={isLoading || callAmount <= 0}
          className="flex flex-col items-center gap-1"
        >
          <Phone className="w-4 h-4" />
          Call {callAmount > 0 && `(${callAmount.toLocaleString()})`}
        </Button>

        <div className="flex flex-col gap-1">
          <Button
            variant="default"
            onClick={() => handleAction('raise', raiseAmount)}
            disabled={isLoading || !canRaise}
            className="flex flex-col items-center gap-1 bg-accent hover:bg-accent/90"
          >
            <TrendingUp className="w-4 h-4" />
            Raise
          </Button>
          <Input
            type="number"
            min={gameState.min_raise}
            max={currentPlayer.chips}
            value={raiseAmount}
            onChange={(e) => setRaiseAmount(Number(e.target.value))}
            className="h-8 text-xs"
          />
        </div>

        <Button
          variant="default"
          onClick={() => handleAction('all-in')}
          disabled={isLoading || !canAllIn}
          className="flex flex-col items-center gap-1 bg-yellow-500 hover:bg-yellow-600 text-black"
        >
          <CircleDot className="w-4 h-4" />
          All In
        </Button>
      </div>
    </div>
  );
}
