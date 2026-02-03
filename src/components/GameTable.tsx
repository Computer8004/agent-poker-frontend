import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import type { GameState } from '@/types';
import { getGameState, startGame } from '@/api';
import { CardHand } from '@/components/PlayingCard';
import { PlayerSeat } from '@/components/PlayerSeat';
import { ActionPanel } from '@/components/ActionPanel';
import { GameLog } from '@/components/GameLog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, Play, Users, Coins, RefreshCw } from 'lucide-react';

interface GameTableProps {
  gameId: string;
  playerAddress: string;
}

export function GameTable({ gameId, playerAddress }: GameTableProps) {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchGameState = useCallback(async () => {
    if (!gameId) return;
    
    try {
      const response = await getGameState(gameId, playerAddress);
      setGameState(response.state);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch game state');
    } finally {
      setIsLoading(false);
    }
  }, [gameId, playerAddress]);

  useEffect(() => {
    fetchGameState();
    
    // Poll for updates every 2 seconds
    const interval = setInterval(fetchGameState, 2000);
    return () => clearInterval(interval);
  }, [fetchGameState]);

  const handleStartGame = async () => {
    if (!gameId) return;
    
    try {
      await startGame(gameId);
      fetchGameState();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start game');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !gameState) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <div className="text-destructive">{error || 'Game not found'}</div>
        <Button onClick={fetchGameState} variant="outline">
          <RefreshCw className="w-4 h-4 mr-2" />
          Retry
        </Button>
      </div>
    );
  }

  const currentPlayer = gameState.players.find(p => p.address.toLowerCase() === playerAddress.toLowerCase());
  const isHost = gameState.players[0]?.address.toLowerCase() === playerAddress.toLowerCase();

  const getPlayerPosition = (index: number, totalPlayers: number): 'top' | 'topLeft' | 'topRight' | 'left' | 'right' | 'bottomLeft' | 'bottomRight' | 'bottom' => {
    if (totalPlayers <= 2) {
      return index === 0 ? 'bottom' : 'top';
    }
    if (totalPlayers === 3) {
      return ['bottom', 'topLeft', 'topRight'][index] as 'bottom' | 'topLeft' | 'topRight';
    }
    if (totalPlayers === 4) {
      return ['bottom', 'left', 'top', 'right'][index] as 'bottom' | 'left' | 'top' | 'right';
    }
    if (totalPlayers === 5) {
      return ['bottom', 'left', 'topLeft', 'topRight', 'right'][index] as 'bottom' | 'left' | 'topLeft' | 'topRight' | 'right';
    }
    if (totalPlayers === 6) {
      return ['bottom', 'bottomLeft', 'left', 'top', 'right', 'bottomRight'][index] as 'bottom' | 'bottomLeft' | 'left' | 'top' | 'right' | 'bottomRight';
    }
    return ['bottom', 'bottomLeft', 'left', 'topLeft', 'topRight', 'right', 'bottomRight', 'bottom'][index] as 'bottom' | 'bottomLeft' | 'left' | 'topLeft' | 'topRight' | 'right' | 'bottomRight';
  };

  return (
    <div className="min-h-screen bg-background p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-4">
          <Badge variant="outline" className="text-primary border-primary/30">
            Game: {gameId?.slice(0, 8)}...
          </Badge>
          <Badge variant="outline" className="capitalize">
            {gameState.phase}
          </Badge>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm">{gameState.players.length} Agents</span>
          </div>
          <div className="flex items-center gap-2">
            <Coins className="w-4 h-4 text-yellow-500" />
            <span className="text-sm">Pot: {gameState.pot.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Game Status */}
      {gameState.status === 'waiting' && (
        <div className="text-center mb-4 p-4 bg-secondary/50 rounded-lg">
          <p className="mb-2">Waiting for agents to join... ({gameState.players.length} players)</p>
          {isHost && (
            <Button onClick={handleStartGame}>
              <Play className="w-4 h-4 mr-2" />
              Start Mission
            </Button>
          )}
        </div>
      )}

      {/* Poker Table */}
      <div className="relative w-full max-w-5xl mx-auto aspect-video poker-table rounded-[50%] border-8 border-[#0d3320] mb-4">
        {/* Community Cards */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <CardHand 
            cards={gameState.community_cards} 
            size="lg"
            className="gap-3"
          />
          
          {gameState.community_cards.length === 0 && gameState.status === 'active' && (
            <div className="text-center text-white/50 text-sm mt-2">
              Community cards will appear here
            </div>
          )}
        </div>

        {/* Pot Display */}
        {gameState.pot > 0 && (
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="bg-yellow-500/90 text-black font-bold px-4 py-2 rounded-full shadow-lg">
              Pot: {gameState.pot.toLocaleString()}
            </div>
          </div>
        )}

        {/* Players */}
        {gameState.players.map((player, index) => (
          <PlayerSeat
            key={player.address}
            player={player}
            isCurrentPlayer={player.address.toLowerCase() === playerAddress.toLowerCase()}
            isCurrentTurn={player.address.toLowerCase() === gameState.currentTurn?.toLowerCase()}
            position={getPlayerPosition(index, gameState.players.length)}
            isDealer={index === gameState.dealerIndex}
          />
        ))}
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
        <div className="lg:col-span-2">
          {currentPlayer && gameState.status === 'active' && (
            <ActionPanel
              gameState={gameState}
              currentPlayer={currentPlayer}
              playerAddress={playerAddress}
              onActionPerformed={fetchGameState}
            />
          )}
        </div>
        
        <div>
          <GameLog logs={gameState.history} />
        </div>
      </div>
    </div>
  );
}
