import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LandingPage } from '@/components/LandingPage';
import { GameTable } from '@/components/GameTable';
import './App.css';

function App() {
  const [gameSession, setGameSession] = useState<{ gameId: string; playerAddress: string } | null>(null);
  const [playerAddress, setPlayerAddress] = useState<string>('');

  useEffect(() => {
    // Check if wallet was previously connected
    const savedAddress = localStorage.getItem('playerAddress');
    if (savedAddress) {
      setPlayerAddress(savedAddress);
    }
  }, []);

  const handleConnectWallet = async () => {
    // For now, use a prompt. In production, this would use MetaMask or other wallet
    const address = prompt('Enter your wallet address (0x...):');
    if (address && address.startsWith('0x')) {
      setPlayerAddress(address);
      localStorage.setItem('playerAddress', address);
    }
  };

  const handleGameCreated = (gameId: string, address: string) => {
    setGameSession({ gameId, playerAddress: address });
  };

  const handleGameJoined = (gameId: string, address: string) => {
    setGameSession({ gameId, playerAddress: address });
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
                playerAddress={playerAddress}
                onConnectWallet={handleConnectWallet}
              />
            )
          }
        />
        <Route
          path="/game/:gameId"
          element={
            gameSession ? (
              <GameTable 
                gameId={gameSession.gameId} 
                playerAddress={gameSession.playerAddress} 
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
