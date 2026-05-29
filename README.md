# caro-phonel — Gomoku / Five-in-a-row

A Vietnamese Gomoku (Caro) game with real-time multiplayer via room codes. No account needed.

## Tech Stack

- **Frontend**: Next.js 15, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes (in-memory for MVP, can switch to MongoDB)
- **Monorepo**: npm workspaces

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Install

```bash
cd apps/web
npm install
```

### Run Development

```bash
cd apps/web
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
caro-phonel/
├── apps/
│   ├── web/           # Next.js 15 frontend
│   │   ├── src/
│   │   │   ├── app/           # App Router pages + API routes
│   │   │   │   ├── api/      # REST API endpoints
│   │   │   │   ├── room/     # Game room page
│   │   │   │   └── page.tsx  # Lobby page
│   │   │   ├── components/   # UI + Game components
│   │   │   ├── lib/          # Engine, player, api config
│   │   │   └── types/        # TypeScript types
│   │   └── package.json
│   └── api/           # (Future: FastAPI backend)
└── package.json      # Root workspace config
```

## Game Rules

- 15x15 board
- Black (1) moves first
- Players alternate placing stones
- First to connect 5 in a row (horizontal, vertical, or diagonal) wins
- Draw if board is full with no winner

## MongoDB (Future)

For production with MongoDB, set environment variable:
```
NEXT_PUBLIC_MONGODB_URI=mongodb://10.60.184.61:27017/carophil
```

## License

MIT
