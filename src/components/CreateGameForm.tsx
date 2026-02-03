import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UserPlus, Users, Coins, Bot } from 'lucide-react';
import { createGame } from '@/api';

interface CreateGameFormProps {
  onGameCreated: (gameId: string, playerId: string, sessionToken: string) => void;
}

export function CreateGameForm({ onGameCreated }: CreateGameFormProps) {
  const [playerName, setPlayerName] = useState('');
  const [startingChips, setStartingChips] = useState(1000);
  const [numBots, setNumBots] = useState(3);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await createGame(playerName, startingChips, numBots);
      onGameCreated(response.gameId, response.playerId, response.sessionToken);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create game');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="agent-card w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-primary">
          <UserPlus className="w-5 h-5" />
          Create New Game
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
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
              className="bg-secondary/50 border-primary/20 focus:border-primary"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="startingChips" className="flex items-center gap-2">
              <Coins className="w-4 h-4" />
              Starting Chips
            </Label>
            <Input
              id="startingChips"
              type="number"
              min={100}
              max={10000}
              value={startingChips}
              onChange={(e) => setStartingChips(Number(e.target.value))}
              required
              className="bg-secondary/50 border-primary/20 focus:border-primary"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="numBots" className="flex items-center gap-2">
              <Bot className="w-4 h-4" />
              Number of Bot Agents
            </Label>
            <Input
              id="numBots"
              type="number"
              min={1}
              max={8}
              value={numBots}
              onChange={(e) => setNumBots(Number(e.target.value))}
              required
              className="bg-secondary/50 border-primary/20 focus:border-primary"
            />
          </div>

          {error && (
            <div className="text-destructive text-sm p-2 bg-destructive/10 rounded">{error}</div>
          )}

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 agent-glow"
          >
            {isLoading ? 'Creating...' : 'Initialize Game'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
