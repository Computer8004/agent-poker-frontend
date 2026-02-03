import { useState } from 'react';
import { CreateGameForm } from '@/components/CreateGameForm';
import { JoinGameForm } from '@/components/JoinGameForm';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Shield, UserPlus, LogIn, Sparkles, Wallet } from 'lucide-react';

interface LandingPageProps {
  onGameCreated: (gameId: string, playerAddress: string) => void;
  onGameJoined: (gameId: string, playerAddress: string) => void;
  playerAddress: string;
  onConnectWallet: () => void;
}

export function LandingPage({ onGameCreated, onGameJoined, playerAddress, onConnectWallet }: LandingPageProps) {
  const [mode, setMode] = useState<'landing' | 'create' | 'join'>('landing');

  if (!playerAddress) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse-neon" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse-neon" style={{ animationDelay: '1s' }} />
        </div>

        <div className="relative z-10 text-center max-w-2xl mx-auto">
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 border-2 border-primary/30 mb-6 agent-glow">
              <Shield className="w-10 h-10 text-primary" />
            </div>
            
            <h1 className="text-5xl font-bold mb-4 agent-text-glow">
              Agent Poker
            </h1>
            
            <p className="text-xl text-muted-foreground mb-2">
              High-Stakes Intelligence Operations
            </p>
          </div>

          <Card className="agent-card border-primary/20">
            <CardContent className="p-6">
              <Button
                size="lg"
                onClick={onConnectWallet}
                className="w-full h-20 flex flex-col items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 agent-glow"
              >
                <Wallet className="w-6 h-6" />
                <div className="text-left">
                  <div className="font-semibold">Connect Wallet</div>
                  <div className="text-xs opacity-80">Required to play</div>
                </div>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (mode === 'create') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Button 
            variant="ghost" 
            onClick={() => setMode('landing')}
            className="mb-4"
          >
            ← Back
          </Button>
          <CreateGameForm onGameCreated={onGameCreated} playerAddress={playerAddress} />
        </div>
      </div>
    );
  }

  if (mode === 'join') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Button 
            variant="ghost" 
            onClick={() => setMode('landing')}
            className="mb-4"
          >
            ← Back
          </Button>
          <JoinGameForm onGameJoined={onGameJoined} playerAddress={playerAddress} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse-neon" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse-neon" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative z-10 text-center max-w-2xl mx-auto">
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 border-2 border-primary/30 mb-6 agent-glow">
            <Shield className="w-10 h-10 text-primary" />
          </div>
          
          <h1 className="text-5xl font-bold mb-4 agent-text-glow">
            Agent Poker
          </h1>
          
          <p className="text-xl text-muted-foreground mb-2">
            High-Stakes Intelligence Operations
          </p>
          
          <div className="flex items-center justify-center gap-2 text-sm text-primary/70">
            <Sparkles className="w-4 h-4" />
            <span>Connected: {playerAddress.slice(0, 6)}...{playerAddress.slice(-4)}</span>
            <Sparkles className="w-4 h-4" />
          </div>
        </div>

        <Card className="agent-card border-primary/20">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button
                size="lg"
                onClick={() => setMode('create')}
                className="h-20 flex flex-col items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 agent-glow"
              >
                <UserPlus className="w-6 h-6" />
                <div className="text-left">
                  <div className="font-semibold">Create Game</div>
                  <div className="text-xs opacity-80">Start a new mission</div>
                </div>
              </Button>

              <Button
                size="lg"
                onClick={() => setMode('join')}
                variant="outline"
                className="h-20 flex flex-col items-center gap-2 border-accent/50 hover:bg-accent/10"
              >
                <LogIn className="w-6 h-6" />
                <div className="text-left">
                  <div className="font-semibold">Join Game</div>
                  <div className="text-xs opacity-80">Infiltrate existing</div>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
