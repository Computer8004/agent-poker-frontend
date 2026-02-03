import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LandingPage } from '@/components/LandingPage';
import { GameTable } from '@/components/GameTable';
import { useAccount } from 'wagmi';
import './App.css';

function App() {
  const [gameSession, setGameSession] = useState<{ gameId: string; playerAddress: string } | null>(null);
  const { address, isConnected } = useAccount();

  // Restore game session from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('gameSession');
    if (saved) {
      setGameSession(JSON.parse(saved));
    }
  }, []);

  // Save game session when it changes
  useEffect(() => {
    if (gameSession) {
      localStorage.setItem('gameSession', JSON.stringify(gameSession));
    } else {
      localStorage.removeItem('gameSession');
    }
  }, [gameSession]);

  const handleGameCreated = (gameId: string, playerAddress: string) => {
    setGameSession({ gameId, playerAddress });
  };

  const handleGameJoined = (gameId: string, playerAddress: string) => {
    setGameSession({ gameId, playerAddress });
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            gameSession && isConnected && address ? (
              <Navigate to={`/game/${gameSession.gameId}`} replace />
            ) : (
              <LandingPage
                onGameCreated={handleGameCreated}
                onGameJoined={handleGameJoined}
              />
            )
          }
        />
        <Route
          path="/game/:gameId"
          element={
            gameSession && isConnected && address ? (
              <GameTable 
                gameId={gameSession.gameId} 
                playerAddress={address} 
              />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
