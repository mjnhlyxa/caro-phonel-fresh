# caro-phonel — Technical Plan

> **Status**: Draft | Created: 2026-05-29 | Last Updated: 2026-05-29
> **C4 Level**: 1 — Context Overview

## 1. Game Overview

### 1.1 Game Concept
Caro-phonel (Gomoku/Five-in-a-row) is a classic Vietnamese strategy board game where two players take turns placing stones on a 15x15 grid, each trying to connect five of their stones in a row horizontally, vertically, or diagonally before their opponent does. The game is played online with a friend in real-time, featuring a clean Vietnamese-themed design that evokes the nostalgia of playing caro on paper.

### 1.2 Game Type
- **Genre**: Strategy / Board game
- **Platform**: Web browser (desktop primary, mobile responsive)
- **Session Length**: Quick 5-15 minute games
- **Multiplayer Model**: Real-time 1v1 via room codes with WebSocket sync
- **Account Required**: No — anonymous play supported

### 1.3 Target Audience
- Casual players who enjoy classic strategy games
- Vietnamese diaspora wanting to play caro online with friends and family
- Players who want quick, no-signup gameplay with a shared link
- Desktop and mobile users (iOS/Android browsers)

## 2. System Context (C4 L1)

### 2.1 User Interactions

```
┌─────────────────────────────────────────────────────────────────┐
│                        USERS                                   │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐    │
│  │ Desktop     │  │ Mobile     │  │ Future: Spectator   │    │
│  │ Browser     │  │ Browser    │  │ Browser             │    │
│  └──────┬──────┘  └──────┬──────┘  └──────────┬─────────┘    │
└─────────┼────────────────┼─────────────────────┼──────────────┘
          │                │                     │
          ▼                ▼                     ▼
┌────────────────────────────────────────────────────────────────┐
│                   caro-phonel                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ Frontend: Next.js 15 (App Router, Bun)                   │  │
│  │ - Landing page (create/join room)                          │  │
│  │ - Game page (15x15 board, real-time sync)                │  │
│  │ - Result overlay (win/draw)                               │  │
│  └──────────────────────────┬──────────────────────────────┘  │
│                             │ WebSocket / HTTP REST            │
│  ┌──────────────────────────▼──────────────────────────────┐  │
│  │ Backend: FastAPI (apps/api)                               │  │
│  │ - Room management (create/join/list)                       │  │
│  │ - Game state management                                    │  │
│  │ - WebSocket broadcasting (Socket.IO)                       │  │
│  │ - Win detection logic                                      │  │
│  └──────────────────────────┬──────────────────────────────┘  │
│                             │                                  │
│  ┌──────────────────────────▼──────────────────────────────┐  │
│  │ Database: MongoDB 10.60.184.61:27017                    │  │
│  │ - rooms collection                                        │  │
│  │ - games collection                                        │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                               │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ CDN: Vercel Edge / Cloudflare                           │  │
│  │ - Static asset caching                                   │  │
│  │ - SSL termination                                        │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

### 2.2 External System Integrations
| External System | Purpose | Integration Method |
|-----------------|---------|-------------------|
| MongoDB Atlas | Persistent game data | MongoDB Driver (PyMongo) |
| Vercelt | Hosting & Serverless | Auto-deploy on git push |
| Socket.IO | Real-time WebSocket | Python socketio library |
| GitHub | Source code & CI/CD | Git push trigger |

### 2.3 Data Flow Overview
High-level data flow for caro-phonel:

1. Player A opens URL → Vercel serves Next.js landing page
2. Player A creates a room → API call to FastAPI → MongoDB saves room
3. Player A shares room link/CODE with Player B
4. Player B opens link → joins room via API → WebSocket notified
5. Game starts → players take turns placing stones
6. Each move → WebSocket broadcasts to opponent → board updates in real-time
7. Win detected → result saved to MongoDB → winner overlay shown
8. Option to rematch or share new room

### 2.4 Key Non-Functional Requirements
- **Performance**: First contentful paint < 1.5s, time to interactive < 2.5s
- **Scalability**: Support 50 concurrent games (100 players)
- **Availability**: 99.5% uptime (Vercel SLA)
- **Data Persistence**: All game data persists across sessions
- **Mobile Support**: Full gameplay at 375px viewport, touch-friendly targets (44px min)
- **Real-time Latency**: WebSocket round-trip < 200ms

## 3. Technology Stack Summary

| Layer | Technology | Version | Notes |
|-------|-----------|---------|-------|
| Monorepo | Bun | 1.x | Bun runtime for everything |
| Frontend | Next.js | 15 | App Router, TypeScript |
| Backend | FastAPI | 0.100+ | Python async API |
| Database | MongoDB | 6.x | 10.60.184.61:27017 |
| Real-time | Socket.IO | 4.x | WebSocket wrapper |
| Styling | Tailwind CSS | 3.x | Mobile-first |
| DB Driver | PyMongo | 4.x | MongoDB Python driver |
| Hosting | Vercel | — | Serverless (Vercel Python) |
| Git | GitHub | — | mjnhlyxa repo |

## 4. Security Considerations
- Anonymous player IDs (UUID v4) stored in localStorage — no PII
- No authentication required for MVP
- Input validation on all API endpoints (Pydantic)
- Rate limiting on API routes
- Room codes are 6-character alphanumeric (unguessable)

## 5. Cost Projection (Free Tier)

| Service | Free Tier Limit | Projected Usage | Buffer |
|---------|-----------------|-----------------|--------|
| Vercel | 100GB bandwidth/mo | ~2GB (50 concurrent users) | OK |
| MongoDB | 512MB Atlas M0 | ~20MB (5000 games) | OK |
| GitHub | Unlimited | — | OK |

## 6. Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| MongoDB connection limits | Low | Medium | Connection pooling |
| WebSocket disconnections | Medium | Low | Auto-reconnect with exponential backoff |
| Room code collisions | Very Low | High | 6-char alphanumeric = 2B+ combinations |
| Concurrent user limits | Low | Medium | Room queue system |
| Vercel cold starts | Low | Low | Keep functions warm via health checks |
