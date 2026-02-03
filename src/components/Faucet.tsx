import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Droplets, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseAbi } from 'viem';

const FELT_TOKEN_ADDRESS = '0x59755774E7dfE512638bA22aA4B6D30097a7b88E';

const feltAbi = parseAbi([
  'function claimTokens() external',
  'function balanceOf(address account) view returns (uint256)',
  'function canClaim(address user) view returns (bool)',
  'function timeUntilNextClaim(address user) view returns (uint256)',
]);

export function Faucet() {
  const { address } = useAccount();
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const { writeContract, isPending, data: hash } = useWriteContract();

  const { isLoading: isConfirming } = useWaitForTransactionReceipt({
    hash,
  });

  const handleClaim = async () => {
    if (!address) return;
    
    setError('');
    setSuccess(false);

    try {
      writeContract({
        address: FELT_TOKEN_ADDRESS,
        abi: feltAbi,
        functionName: 'claimTokens',
      });
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to claim tokens');
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
          <p>Claim free $FELT tokens to play Agent Poker!</p>
          <ul className="mt-2 space-y-1 text-xs">
            <li>• 10,000 $FELT per claim</li>
            <li>• 4 hour cooldown between claims</li>
            <li>• No cost (just gas)</li>
          </ul>
        </div>

        {success && hash && (
          <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-lg flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <div className="text-sm">
              <p className="text-green-500 font-medium">Tokens claimed!</p>
              <a 
                href={`https://basescan.org/tx/${hash}`}
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
          disabled={isPending || isConfirming || !address}
          className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
        >
          {isPending || isConfirming ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              {isPending ? 'Confirm in wallet...' : 'Claiming...'}
            </>
          ) : (
            <>
              <Droplets className="w-4 h-4 mr-2" />
              Claim 10,000 $FELT
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
