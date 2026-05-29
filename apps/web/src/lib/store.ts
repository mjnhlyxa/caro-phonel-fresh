// Shared in-memory store for MVP
// This module is imported by API routes to share state

declare global {
  var __rooms: Map<string, any> | undefined;
  var __roomCodes: Map<string, string> | undefined;
  var __games: Map<string, any> | undefined;
}

if (!global.__rooms) {
  global.__rooms = new Map();
}
if (!global.__roomCodes) {
  global.__roomCodes = new Map();
}
if (!global.__games) {
  global.__games = new Map();
}

export const rooms = global.__rooms;
export const roomCodes = global.__roomCodes;
export const games = global.__games;

export function generateCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

export function nanoid() {
  return Math.random().toString(36).substring(2, 15);
}
