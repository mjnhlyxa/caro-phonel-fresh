// API base URL configuration
// Uses relative URLs for same-origin deployment (Vercel)
// For local development, Next.js API routes are served at /api/*

const API_BASE = '';

export const API_URL = {
  createRoom: () => `${API_BASE}/api/rooms`,
  listRooms: () => `${API_BASE}/api/rooms`,
  getRoom: (code: string) => `${API_BASE}/api/rooms/${code}`,
  joinRoom: (code: string) => `${API_BASE}/api/rooms/${code}/join`,
  leaveRoom: (code: string) => `${API_BASE}/api/rooms/${code}/leave`,
  createGame: () => `${API_BASE}/api/games`,
  getGame: (gameId: string) => `${API_BASE}/api/games/${gameId}`,
  makeMove: (gameId: string) => `${API_BASE}/api/games/${gameId}/move`,
};

export default API_URL;
