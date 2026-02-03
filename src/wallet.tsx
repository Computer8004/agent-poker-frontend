import '@rainbow-me/rainbowkit/styles.css';
import { RainbowKitProvider, getDefaultConfig } from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import { base } from 'wagmi/chains';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

export const config = getDefaultConfig({
  appName: 'Agent Poker',
  projectId: 'agent-poker-2026', // Replace with actual WalletConnect project ID if you have one
  chains: [base],
  ssr: false,
});

export { RainbowKitProvider, WagmiProvider, QueryClientProvider, queryClient };
