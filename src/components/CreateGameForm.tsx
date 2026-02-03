import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UserPlus, Users, Coins } from 'lucide-react';
import { createGame } from '@/api';

interface CreateGameFormProps {
  onGameCreated: (gameId: string, playerAddress: string) => void;
  playerAddress: string;
}

export function CreateGameForm({ onGameCreated, playerAddress }: CreateGameFormProps) {
  const [playerName, setPlayerName] = useState('');
  const [smallBlind, setSmallBlind] = useState(10);
  const [bigBlind, setBigBlind] = useState(20);
  const [minBuyIn, setMinBuyIn] = useState(400);
  const [maxBuyIn, setMaxBuyIn] = useState(2000);
  const [maxPlayers, setMaxPlayers] = useState(6);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await createGame(
        playerAddress,
        playerName,
        smallBlind,
        bigBlind,
        minBuyIn,
        maxBuyIn,
        maxPlayers
      );
      onGameCreated(response.gameId.toString(), playerAddress);
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

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="smallBlind" className="flex items-center gap-2">
                <Coins className="w-4 h-4" />
                Small Blind
              </Label>
              <Input
                id="smallBlind"
                type="number"
                min={1}
                value={smallBlind}
                onChange={(e) => setSmallBlind(Number(e.target.value))}
                required
                className="bg-secondary/50 border-primary/20 focus:border-primary"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bigBlind" className="flex items-center gap-2">
                <Coins className="w-4 h-4" />
                Big Blind
              </Label>
              <Input
                id="bigBlind"
                type="number"
                min={2}
                value={bigBlind}
                onChange={(e) => setBigBlind(Number(e.target.value))}
                required
                className="bg-secondary/50 border-primary/20 focus:border-primary"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="minBuyIn">Min Buy-in</Label>
              <Input
                id="minBuyIn"
                type="number"
                min={20}
                value={minBuyIn}
                onChange={(e) => setMinBuyIn(Number(e.target.value))}
                required
                className="bg-secondary/50 border-primary/20 focus:border-primary"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxBuyIn">Max Buy-in</Label>
              <Input
                id="maxBuyIn"
                type="number"
                min={20}
                value={maxBuyIn}
                onChange={(e) => setMaxBuyIn(Number(e.target.value))}
                required
                className="bg-secondary/50 border-primary/20 focus:border-primary"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="maxPlayers">Max Players</Label>
            <Input
              id="maxPlayers"
              type="number"
              min={2}
              max={9}
              value={maxPlayers}
              onChange={(e) => setMaxPlayers(Number(e.target.value))}
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
