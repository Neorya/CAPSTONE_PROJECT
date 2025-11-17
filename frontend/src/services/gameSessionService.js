import {API_BASE_URL, API_ENDPOINTS} from './config';

export async function createGameSession(matchIds, creatorId) {
  const url = new URL(API_ENDPOINTS.GAME_SESSIONS, API_BASE_URL);
  const res = await fetch(url.toString(), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ 
        match_id: matchIds,
        creator_id: creatorId
    }),
  });
  if (!res.ok) {
    throw new Error(`Failed to create game session: ${res.statusText}`);
  }
  return res.json();
}