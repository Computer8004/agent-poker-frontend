import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import type { GameState, Player } from '@/types';
import { 
  X, Check, Phone, TrendingUp, CircleDot, 
  Users, Coins, Play, Loader2, RefreshCw,
  ChevronUp, ChevronDown, Eye, EyeOff
} from 'lucide-react';
import { performAction } from '@/api';

interface GameUIOverlayProps {
  gameState: GameState;
  currentPlayer: Player | undefined;
  playerAddress: string;
  gameId: string;
  onActionPerformed: () => void;
  onStartGame: () => void;
  viewMode: 'overview' | 'player' | 'action';
  onSwitchView: (mode: 'overview' | 'player' | 'action') => void;
  isLoading?: boolean;
  error?: string;
}



export function GameUIOverlay({
  gameState,
  currentPlayer,
  playerAddress,
  gameId,
  onActionPerformed,
  onStartGame,
  viewMode,
  onSwitchView,
  isLoading,
  error,
}: GameUIOverlayProps) {
  const [raiseAmount, setRaiseAmount] = useState(gameState.currentBet * 2);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState('');
  const [showActions, setShowActions] = useState(true);

  const isHost = gameState.players[0]?.address.toLowerCase() === playerAddress.toLowerCase();
  const isMyTurn = gameState.currentTurn?.toLowerCase() === playerAddress.toLowerCase();
  const canCheck = gameState.currentBet === 0 || gameState.currentBet === currentPlayer?.currentBet;
  const callAmount = gameState.currentBet - (currentPlayer?.currentBet || 0);
  const canRaise = (currentPlayer?.chips || 0) > callAmount + gameState.currentBet;
  const canAllIn = (currentPlayer?.chips || 0) > 0;

  useEffect(() => {
    setRaiseAmount(gameState.currentBet * 2);
  }, [gameState.currentBet]);

  const handleAction = async (action: 'fold' | 'check' | 'call' | 'raise' | 'all-in', amount?: number) => {
    setActionLoading(true);
    setActionError('');

    try {
      await performAction(gameState.id.toString(), playerAddress, action, amount);
      onActionPerformed();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Action failed');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Top Bar - Game Info */}
      <motion.div 
        className="absolute top-0 left-0 right-0 p-4 flex justify-between items-start pointer-events-auto"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-3">
          <motion.div 
            className="bg-black/60 backdrop-blur-md border border-primary/30 rounded-lg px-4 py-2"
            whileHover={{ scale: 1.05 }}
          >
            <div className="text-xs text-primary/70 uppercase tracking-wider">Game ID</div>
            <div className="text-lg font-mono font-bold text-primary">
              #{gameId?.slice(0, 8)}...
            </div>
          </motion.div>
          
          <motion.div 
            className="bg-black/60 backdrop-blur-md border border-accent/30 rounded-lg px-4 py-2"
            whileHover={{ scale: 1.05 }}
          >
            <div className="text-xs text-accent/70 uppercase tracking-wider">Phase</div>
            <div className="text-lg font-bold text-accent capitalize">
              {gameState.phase}
            </div>
          </motion.div>
        </div>

        <div className="flex items-center gap-3">
          <motion.div 
            className="bg-black/60 backdrop-blur-md border border-yellow-500/30 rounded-lg px-4 py-2"
            whileHover={{ scale: 1.05 }}
          >
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-yellow-500" />
              <span className="text-lg font-bold text-yellow-500">
                {gameState.players.length} Agents
              </span>
            </div>
          </motion.div>
          
          <motion.div 
            className="bg-black/60 backdrop-blur-md border border-yellow-500/30 rounded-lg px-4 py-2"
            whileHover={{ scale: 1.05 }}
          >
            <div className="flex items-center gap-2">
              <Coins className="w-4 h-4 text-yellow-500" />
              <span className="text-lg font-bold text-yellow-500">
                Pot: {gameState.pot.toLocaleString()}
              </span>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* View Mode Controls */}
      <motion.div
        className="absolute top-24 right-4 flex flex-col gap-2 pointer-events-auto"
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {(['overview', 'player', 'action'] as const).map((mode) => (
          <Button
            key={mode}
            variant={viewMode === mode ? 'default' : 'outline'}
            size="sm"
            onClick={() => onSwitchView(mode)}
            className={`capitalize ${
              viewMode === mode 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-black/60 backdrop-blur-md border-white/20 text-white'
            }`}
          >
            {mode}
          </Button>
        ))}
      </motion.div>

      {/* Waiting State */}
      <AnimatePresence>
        {gameState.status === 'waiting' && (
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-auto"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
          >
            <Card className="bg-black/80 backdrop-blur-md border-primary/30">
              <CardContent className="p-6 text-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  className="inline-block mb-4"
                >
                  <Loader2 className="w-8 h-8 text-primary" />
                </motion.div>
                <p className="text-lg text-white mb-4">
                  Waiting for agents... ({gameState.players.length} players)
                </p>
                {isHost && (
                  <Button 
                    onClick={onStartGame}
                    className="bg-primary hover:bg-primary/90 agent-glow"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Start Mission
                  </Button>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Action Panel */}
      <AnimatePresence>
        {currentPlayer && gameState.status === 'active' && showActions && (
          <motion.div
            className="absolute bottom-0 left-0 right-0 p-4 pointer-events-auto"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
          >
            <Card className="bg-black/80 backdrop-blur-md border-primary/30 max-w-4xl mx-auto">
              <CardContent className="p-4">
                {!isMyTurn ? (
                  <div className="text-center text-muted-foreground py-4">
                    Waiting for other agents...
                  </div>
                ) : (
                  <>
                    <motion.div 
                      className="text-center mb-4"
                      animate={{ 
                        textShadow: [
                          '0 0 10px rgba(0, 255, 136, 0.5)',
                          '0 0 20px rgba(0, 255, 136, 0.8)',
                          '0 0 10px rgba(0, 255, 136, 0.5)'
                        ]
                      }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <span className="text-primary font-bold text-lg">YOUR TURN</span>
                    </motion.div>

                    {actionError && (
                      <motion.div 
                        className="text-destructive text-sm p-2 bg-destructive/10 rounded mb-4"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        {actionError}
                      </motion.div>
                    )}

                    <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                      <ActionButton
                        action="fold"
                        icon={<X className="w-4 h-4" />}
                        label="Fold"
                        variant="destructive"
                        onClick={() => handleAction('fold')}
                        disabled={actionLoading}
                      />

                      <ActionButton
                        action="check"
                        icon={<Check className="w-4 h-4" />}
                        label="Check"
                        variant="secondary"
                        onClick={() => handleAction('check')}
                        disabled={actionLoading || !canCheck}
                      />

                      <ActionButton
                        action="call"
                        icon={<Phone className="w-4 h-4" />}
                        label={callAmount > 0 ? `Call ${callAmount.toLocaleString()}` : 'Call'}
                        variant="default"
                        onClick={() => handleAction('call')}
                        disabled={actionLoading || callAmount <= 0}
                      />

                      <div className="flex flex-col gap-1">
                        <ActionButton
                          action="raise"
                          icon={<TrendingUp className="w-4 h-4" />}
                          label="Raise"
                          variant="accent"
                          onClick={() => handleAction('raise', raiseAmount)}
                          disabled={actionLoading || !canRaise}
                        />
                        <Input
                          type="number"
                          min={gameState.currentBet * 2}
                          max={currentPlayer?.chips}
                          value={raiseAmount}
                          onChange={(e) => setRaiseAmount(Number(e.target.value))}
                          className="h-8 text-xs bg-black/50 border-primary/30"
                        />
                      </div>

                      <ActionButton
                        action="all-in"
                        icon={<CircleDot className="w-4 h-4" />}
                        label="All In"
                        variant="warning"
                        onClick={() => handleAction('all-in')}
                        disabled={actionLoading || !canAllIn}
                      />
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle Actions Button */}
      {currentPlayer && gameState.status === 'active' && (
        <motion.button
          className="absolute bottom-4 right-4 p-2 bg-black/60 backdrop-blur-md border border-primary/30 rounded-full pointer-events-auto"
          onClick={() => setShowActions(!showActions)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          {showActions ? (
            <ChevronDown className="w-5 h-5 text-primary" />
          ) : (
            <ChevronUp className="w-5 h-5 text-primary" />
          )}
        </motion.button>
      )}

      {/* Loading Overlay */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center pointer-events-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            >
              <Loader2 className="w-12 h-12 text-primary" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error Toast */}
      <AnimatePresence>
        {error && (
          <motion.div
            className="absolute top-24 left-1/2 -translate-x-1/2 pointer-events-auto"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
          >
            <Card className="bg-destructive/90 border-destructive">
              <CardContent className="p-4 flex items-center gap-3">
                <span className="text-destructive-foreground">{error}</span>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => window.location.reload()}
                  className="text-destructive-foreground"
                >
                  <RefreshCw className="w-4 h-4 mr-1" />
                  Retry
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface ActionButtonProps {
  action: string;
  icon: React.ReactNode;
  label: string;
  variant: 'destructive' | 'secondary' | 'default' | 'accent' | 'warning';
  onClick: () => void;
  disabled?: boolean;
}

function ActionButton({ action, icon, label, variant, onClick, disabled }: ActionButtonProps) {
  const variantStyles = {
    destructive: 'bg-red-600 hover:bg-red-700 text-white',
    secondary: 'bg-slate-600 hover:bg-slate-700 text-white',
    default: 'bg-primary hover:bg-primary/90 text-primary-foreground',
    accent: 'bg-accent hover:bg-accent/90 text-accent-foreground',
    warning: 'bg-yellow-500 hover:bg-yellow-600 text-black',
  };

  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      className={`flex flex-col items-center gap-1 p-3 rounded-lg font-semibold transition-all ${
        variantStyles[variant]
      } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      whileHover={!disabled ? { scale: 1.05, y: -2 } : {}}
      whileTap={!disabled ? { scale: 0.95 } : {}}
    >
      {icon}
      <span className="text-sm">{label}</span>
    </motion.button>
  );
}
