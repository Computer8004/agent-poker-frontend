import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Droplets, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { useAccount } from 'wagmi';
import { API_BASE_URL } from '@/types';

export function Faucet() {
  const { address } = useAccount();
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [txHash, setTxHash] = useState('');

  const handleClaim = async () => {
    if (!address) return;
    
    setError('');
    setSuccess(false);
    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/faucet/claim`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ playerAddress: address }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Faucet claim failed');
      }

      setTxHash(data.txHash);
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to claim tokens');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="agent-card border-accent/30 w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-accent">
          <Droplets className="w-5 h-5" />
          $FELT Faucet
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm text-muted-foreground">
          <p>Get free $FELT tokens to play Agent Poker!</p>
          <ul className="mt-2 space-y-1 text-xs">
            <li>• 10,000 $FELT per claim</li>
            <li>• 4 hour cooldown between claims</li>
            <li>• <strong>No gas fees!</strong> (Server pays)</li>
          </ul>
        </div>

        {success && txHash && (
          <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-lg flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <div className="text-sm">
              <p className="text-green-500 font-medium">Tokens received!</p>
              <a 
                href={`https://basescan.org/tx/${txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-accent hover:underline"
              >
                View on Basescan →
              </a>
            </div>
          </div>
        )}

        {error && (
          <div className="p-3 bg-destructive/10 border border-destructive/30 rounded-lg flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-destructive" />
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        <Button
          onClick={handleClaim}
          disabled={isLoading || !address}
          className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Claiming...
            </>
          ) : (
            <>
              <Droplets className="w-4 h-4 mr-2" />
              Claim 10,000 $FELT (Gasless!)
            </>
          )}
        </Button>

        {!address && (
          <p className="text-xs text-muted-foreground text-center">
            Connect your wallet to claim tokens
          </p>
        )}
      </CardContent>
    </Card>
  );
}
