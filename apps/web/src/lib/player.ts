// Anonymous player identity management

const PLAYER_ID_KEY = 'carophil_player_id';
const PLAYER_NAME_KEY = 'carophil_player_name';

export function getOrCreatePlayerId(): string {
  if (typeof window === 'undefined') return '';
  let id = localStorage.getItem(PLAYER_ID_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(PLAYER_ID_KEY, id);
  }
  return id;
}

export function getPlayerName(): string {
  if (typeof window === 'undefined') return 'Anonymous';
  return localStorage.getItem(PLAYER_NAME_KEY) || 'Anonymous';
}

export function setPlayerName(name: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(PLAYER_NAME_KEY, name || 'Anonymous');
  }
}

export function clearPlayerData(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(PLAYER_ID_KEY);
    localStorage.removeItem(PLAYER_NAME_KEY);
  }
}
