# caro-phonel — Technology Stack

> **C4 Level**: 2 — Technology Choices

## 1. Monorepo

### 1.1 Bun Workspace
```json
// package.json (root)
{
  "name": "caro-phonel",
  "workspaces": ["apps/*"],
  "scripts": {
    "dev": "bun --cwd apps/web dev",
    "api": "bun --cwd apps/api dev"
  }
}
```

## 2. Frontend Stack (apps/web)

| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| Framework | Next.js | 15 | App Router, SSG, API proxy |
| Language | TypeScript | 5.x | Type safety |
| Runtime | Bun | 1.x | Fast dev server |
| Styling | Tailwind CSS | 3.x | Mobile-first CSS |
| State | React useState/useReducer | 18 | Client state |
| HTTP | fetch (built-in) | — | REST API calls |
| Socket.IO | socket.io-client | 4.x | Real-time WebSocket |
| Deployment | Vercel | — | Edge hosting |

### 2.1 Key Dependencies (apps/web)
```json
{
  "next": "^15.0.0",
  "react": "^18.3.1",
  "react-dom": "^18.3.1",
  "socket.io-client": "^4.7.5",
  "tailwindcss": "^3.4.0",
  "typescript": "^5.4.0"
}
```

## 3. Backend Stack (apps/api)

| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| Framework | FastAPI | 0.100+ | Async REST API |
| Language | Python | 3.11+ | Core API logic |
| Runtime | Bun (via pyodide) | — | Alternative to uvicorn |
| Database | PyMongo | 4.x | MongoDB driver |
| WebSocket | python-socketio | 4.x | Socket.IO server |
| Validation | Pydantic | 2.x | Input validation |
| Deployment | Vercel (Python) | — | Serverless functions |

### 3.1 Key Dependencies (apps/api)
```json
{
  "fastapi": "^0.100.0",
  "uvicorn": "^0.23.0",
  "python-socketio": "^4.7.5",
  "pymongo": "^4.6.0",
  "pydantic": "^2.5.0"
}
```

## 4. Shared Types

TypeScript types defined in apps/web/src/types, shared conceptually with Python Pydantic models.

## 5. Development Tools

| Tool | Purpose |
|------|---------|
| ESLint | Linting |
| Prettier | Code formatting |
| VS Code | IDE (recommended) |
| MongoDB Compass | Database viewer |

## 6. Environment

- **Node**: 18+ (for Next.js)
- **Python**: 3.11+ (for FastAPI)
- **Bun**: 1.x (monorepo runner)
- **MongoDB**: 6.x at 10.60.184.61:27017
