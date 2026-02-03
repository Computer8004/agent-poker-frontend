// Types for the Agent Poker game

export interface Card {
  rank: string;
  suit: string;
}

export interface Player {
  address: string;
  name: string;
  chips: number;
  currentBet: number;
  hasFolded: boolean;
  holeCards?: Card[];
}

export interface GameState {
  id: number;
  status: 'waiting' | 'active' | 'finished';
  phase: 'waiting' | 'pre-flop' | 'flop' | 'turn' | 'river' | 'showdown' | 'finished';
  communityCards: Card[];
  pot: number;
  currentBet: number;
  currentTurn: string | null;
  dealerIndex: number;
  smallBlind: number;
  bigBlind: number;
  players: Player[];
  actionHistory: Array<{
    player: string;
    action: string;
    amount?: number;
    timestamp: number;
  }>;
}

export interface CreateGameRequest {
  playerAddress: string;
  playerName: string;
  smallBlind: number;
  bigBlind: number;
  minBuyIn: number;
  maxBuyIn: number;
  maxPlayers: number;
}

export interface CreateGameResponse {
  success: boolean;
  gameId: number;
  message: string;
}

export interface JoinGameRequest {
  playerAddress: string;
  playerName: string;
}

export interface JoinGameResponse {
  success: boolean;
  gameId: number;
  playerCount: number;
  maxPlayers: number;
}

export interface ActionRequest {
  playerAddress: string;
  action: 'fold' | 'check' | 'call' | 'raise' | 'all-in';
  amount?: number;
}

export const API_BASE_URL = 'https://agent-poker-server-production.up.railway.app';

export const SUIT_SYMBOLS: Record<string, string> = {
  hearts: '♥',
  diamonds: '♦',
  clubs: '♣',
  spades: '♠',
};

export const SUIT_COLORS: Record<string, string> = {
  hearts: 'text-red-500',
  diamonds: 'text-red-500',
  clubs: 'text-slate-800',
  spades: 'text-slate-800',
};

export const RANK_DISPLAY: Record<string, string> = {
  '2': '2',
  '3': '3',
  '4': '4',
  '5': '5',
  '6': '6',
  '7': '7',
  '8': '8',
  '9': '9',
  '10': '10',
  'J': 'J',
  'Q': 'Q',
  'K': 'K',
  'A': 'A',
};
