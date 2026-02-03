import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LandingPage } from '@/components/LandingPage';
import { GameTable } from '@/components/GameTable';
import './App.css';

function App() {
  const [gameSession, setGameSession] = useState<{ gameId: string; playerId: string; sessionToken: string } | null>(null);

  const handleGameCreated = (gameId: string, playerId: string, sessionToken: string) => {
    setGameSession({ gameId, playerId, sessionToken });
  };

  const handleGameJoined = (gameId: string, playerId: string, sessionToken: string) => {
    setGameSession({ gameId, playerId, sessionToken });
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            gameSession ? (
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
            gameSession ? (
              <GameTable playerId={gameSession.playerId} sessionToken={gameSession.sessionToken} />
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
