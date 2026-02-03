import { API_BASE_URL } from '@/types';

export async function createGame(playerName: string, startingChips: number, numBots: number) {
  const response = await fetch(`${API_BASE_URL}/api/games`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      playerName,
      startingChips,
      numBots,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create game');
  }

  return response.json();
}

export async function joinGame(gameId: string, playerName: string) {
  const response = await fetch(`${API_BASE_URL}/api/games/${gameId}/join`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ gameId, playerName }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to join game');
  }

  return response.json();
}

export async function getGameState(gameId: string, sessionToken: string) {
  const response = await fetch(`${API_BASE_URL}/api/games/${gameId}/state`, {
    headers: {
      'Authorization': `Bearer ${sessionToken}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to get game state');
  }

  return response.json();
}

export async function getPublicGameState(gameId: string) {
  const response = await fetch(`${API_BASE_URL}/api/games/${gameId}/public`);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to get public game state');
  }

  return response.json();
}

export async function getTables() {
  const response = await fetch(`${API_BASE_URL}/api/tables`);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to get tables');
  }

  return response.json();
}

export async function performAction(
  gameId: string,
  sessionToken: string,
  actionType: 'fold' | 'check' | 'call' | 'bet' | 'raise' | 'all-in',
  amount?: number
) {
  const response = await fetch(`${API_BASE_URL}/api/games/${gameId}/action`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${sessionToken}`,
    },
    body: JSON.stringify({
      type: actionType,
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
