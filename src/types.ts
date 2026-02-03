// Types for the Agent Poker game

export interface Card {
  rank: string;
  suit: string;
}

export interface Player {
  id: string;
  name: string;
  chips: number;
  bet: number;
  folded: boolean;
  is_bot: boolean;
  hole_cards?: Card[];
  is_active: boolean;
}

export interface GameState {
  id: string;
  status: 'waiting' | 'active' | 'finished';
  phase: 'preflop' | 'flop' | 'turn' | 'river' | 'showdown';
  community_cards: Card[];
  pot: number;
  current_bet: number;
  current_player_id: string | null;
  dealer_position: number;
  small_blind: number;
  big_blind: number;
  players: Player[];
  history: GameLogEntry[];
  min_raise: number;
}

export interface GameLogEntry {
  timestamp: string;
  message: string;
  type: 'action' | 'system' | 'winner';
}

export interface CreateGameRequest {
  player_name: string;
  starting_chips: number;
  num_bots: number;
}

export interface CreateGameResponse {
  game_id: string;
  player_id: string;
}

export interface JoinGameRequest {
  game_id: string;
  player_name: string;
}

export interface JoinGameResponse {
  player_id: string;
}

export interface ActionRequest {
  action: 'fold' | 'check' | 'call' | 'raise' | 'all_in';
  amount?: number;
}

export const API_BASE_URL = 'https://pure-growth-production.up.railway.app';

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
  'jack': 'J',
  'queen': 'Q',
  'king': 'K',
  'ace': 'A',
};
