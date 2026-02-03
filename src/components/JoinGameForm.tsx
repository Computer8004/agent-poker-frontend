import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LogIn, Users, Hash } from 'lucide-react';
import { joinGame } from '@/api';

interface JoinGameFormProps {
  onGameJoined: (gameId: string, playerAddress: string) => void;
  playerAddress: string;
}

export function JoinGameForm({ onGameJoined, playerAddress }: JoinGameFormProps) {
  const [gameId, setGameId] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await joinGame(gameId, playerAddress, playerName);
      onGameJoined(gameId, playerAddress);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to join game');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="agent-card w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-accent">
          <LogIn className="w-5 h-5" />
          Join Existing Game
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="gameId" className="flex items-center gap-2">
              <Hash className="w-4 h-4" />
              Game ID
            </Label>
            <Input
              id="gameId"
              value={gameId}
              onChange={(e) => setGameId(e.target.value)}
              placeholder="Enter game ID"
              required
              className="bg-secondary/50 border-accent/20 focus:border-accent font-mono"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="playerName" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Agent Name
            </Label>
            <Input
              id="playerName"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="Enter your agent name"
              required
              className="bg-secondary/50 border-accent/20 focus:border-accent"
            />
          </div>

          <div className="text-sm text-muted-foreground">
            Wallet: {playerAddress.slice(0, 6)}...{playerAddress.slice(-4)}
          </div>

          {error && (
            <div className="text-destructive text-sm p-2 bg-destructive/10 rounded">{error}</div>
          )}

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
            style={{ boxShadow: '0 0 10px rgba(139, 92, 246, 0.3)' }}
          >
            {isLoading ? 'Joining...' : 'Infiltrate Game'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
