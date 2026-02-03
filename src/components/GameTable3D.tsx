import { useState, useEffect, useCallback, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { useParams } from 'react-router-dom';
import type { GameState, Card, Player } from '@/types';
import { getGameState, startGame as apiStartGame } from '@/api';
import { PokerTable3D } from './3d/PokerTable3D';
import { Card3D, CardDeck } from './3d/Card3D';
import { Chip3D, ChipStack, Pot3D } from './3d/Chip3D';
import { PlayerSeat3D, getPlayerPosition } from './3d/PlayerSeat3D';
import { CameraController, useCameraControls } from './3d/CameraController';
import { CasinoLighting, CasinoEnvironment } from './3d/CasinoLighting';
import { GameUIOverlay } from './3d/GameUIOverlay';
import { Button } from '@/components/ui/button';
import { Loader2, RefreshCw } from 'lucide-react';

interface GameTable3DProps {
  gameId: string;
  playerAddress: string;
}

export function GameTable3D({ gameId, playerAddress }: GameTable3DProps) {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const { viewMode, customTarget, switchView } = useCameraControls();
  const canvasRef = useRef<HTMLCanvasElement>(null);

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
      await apiStartGame(gameId);
      fetchGameState();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start game');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0a0a15]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !gameState) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#0a0a15] gap-4">
        <div className="text-destructive">{error || 'Game not found'}</div>
        <Button onClick={fetchGameState} variant="outline">
          <RefreshCw className="w-4 h-4 mr-2" />
          Retry
        </Button>
      </div>
    );
  }

  const currentPlayer = gameState.players.find(
    p => p.address.toLowerCase() === playerAddress.toLowerCase()
  );

  // Get current player index for hole cards positioning
  const currentPlayerIndex = gameState.players.findIndex(
    p => p.address.toLowerCase() === playerAddress.toLowerCase()
  );

  // Calculate community card positions
  const getCommunityCardPosition = (index: number): [number, number, number] => {
    const startX = -((gameState.community_cards.length - 1) * 0.5) / 2;
    return [startX + index * 0.55, 0.05, 0];
  };

  return (
    <div className="relative w-full h-screen bg-[#0a0a15] overflow-hidden">
      <Canvas
        ref={canvasRef}
        shadows
        camera={{ position: [0, 8, 8], fov: 50 }}
        gl={{ antialias: true, alpha: false }}
        style={{ background: '#0a0a15' }}
      >
        <CasinoEnvironment />
        <CasinoLighting />
        
        <CameraController
          viewMode={viewMode}
          targetPosition={customTarget.position}
          targetLookAt={customTarget.lookAt}
          transitionDuration={1.5}
        />

        <PokerTable3D />

        {/* Card Deck */}
        <CardDeck position={[-4, 0.15, -2]} count={52} />

        {/* Community Cards */}
        {gameState.community_cards.map((card: Card, index: number) => (
          <Card3D
            key={`community-${index}`}
            rank={card.rank}
            suit={card.suit}
            position={getCommunityCardPosition(index)}
            rotation={[0, 0, 0]}
            isFlipped={true}
            delay={index * 0.1}
          />
        ))}

        {/* Pot */}
        {gameState.pot > 0 && (
          <Pot3D total={gameState.pot} position={[0, 0.1, -1]} />
        )}

        {/* Players */}
        {gameState.players.map((player, index) => {
          const { position, rotation } = getPlayerPosition(index, gameState.players.length);
          return (
            <PlayerSeat3D
              key={player.address}
              player={player}
              position={position}
              rotation={rotation}
              isCurrentPlayer={player.address.toLowerCase() === playerAddress.toLowerCase()}
              isCurrentTurn={player.address.toLowerCase() === gameState.currentTurn?.toLowerCase()}
              isDealer={index === gameState.dealerIndex}
              delay={index * 0.1}
            />
          );
        })}

        {/* Player hole cards (only for current player) */}
        {currentPlayer?.holeCards?.map((card: Card, index: number) => {
          const { position } = getPlayerPosition(
            currentPlayerIndex,
            gameState.players.length
          );
          return (
            <Card3D
              key={`hole-${index}`}
              rank={card.rank}
              suit={card.suit}
              position={[
                position[0] + (index === 0 ? -0.2 : 0.2),
                0.05,
                position[2] + 0.5
              ]}
              rotation={[0, 0, index === 0 ? -0.1 : 0.1]}
              isFlipped={true}
              delay={0.5 + index * 0.1}
            />
          );
        })}
      </Canvas>

      <GameUIOverlay
        gameState={gameState}
        currentPlayer={currentPlayer}
        playerAddress={playerAddress}
        gameId={gameId}
        onActionPerformed={fetchGameState}
        onStartGame={handleStartGame}
        viewMode={viewMode}
        onSwitchView={switchView}
        isLoading={isLoading}
        error={error}
      />
    </div>
  );
}
