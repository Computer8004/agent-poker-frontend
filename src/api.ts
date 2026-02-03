import { API_BASE_URL } from '@/types';

export async function createGame(
  playerAddress: string,
  playerName: string,
  smallBlind: number,
  bigBlind: number,
  minBuyIn: number,
  maxBuyIn: number,
  maxPlayers: number
) {
  const response = await fetch(`${API_BASE_URL}/api/games`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      playerAddress,
      playerName,
      smallBlind,
      bigBlind,
      minBuyIn,
      maxBuyIn,
      maxPlayers,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create game');
  }

  return response.json();
}

export async function joinGame(gameId: string, playerAddress: string, playerName: string) {
  const response = await fetch(`${API_BASE_URL}/api/games/${gameId}/join`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ playerAddress, playerName }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to join game');
  }

  return response.json();
}

export async function getGameState(gameId: string, playerAddress: string) {
  const response = await fetch(`${API_BASE_URL}/api/games/${gameId}/state?playerAddress=${playerAddress}`);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to get game state');
  }

  return response.json();
}

export async function getPublicGameState(gameId: string) {
  // Server doesn't have this endpoint - we'll use regular state for now
  return getGameState(gameId, '0x0000000000000000000000000000000000000000');
}

export async function getTables() {
  // Server doesn't have this endpoint yet - return empty array for now
  return { tables: [] };
}

export async function performAction(
  gameId: string,
  playerAddress: string,
  actionType: 'fold' | 'check' | 'call' | 'raise' | 'all-in',
  amount?: number
) {
  const response = await fetch(`${API_BASE_URL}/api/games/${gameId}/action`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      playerAddress,
      action: actionType,
      amount,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to perform action');
  }

  return response.json();
}

export async function startGame(gameId: string) {
  const response = await fetch(`${API_BASE_URL}/api/games/${gameId}/start`, {
    method: 'POST',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to start game');
  }

  return response.json();
}
