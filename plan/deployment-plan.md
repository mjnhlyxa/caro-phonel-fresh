# caro-phonel — Deployment Plan

> **C4 Level**: 2+3 — Deployment & Infrastructure

## 1. Repository Structure

```
games/caro-phonel/
├── apps/
│   ├── web/                # Next.js 15 frontend
│   │   ├── src/
│   │   │   ├── app/
│   │   │   ├── components/
│   │   │   └── lib/
│   │   ├── package.json
│   │   └── vercel.json
│   └── api/               # FastAPI backend
│       ├── main.py
│       ├── models/
│       ├── db.py
│       ├── package.json
│       └── vercel.json
├── packages/              # Shared packages (future)
├── package.json           # Bun workspace root
└── bun.lockb
```

## 2. Deployment Targets

| Component | Platform | Pricing Tier |
|-----------|----------|--------------|
| apps/web | Vercel | Hobby (free) |
| apps/api | Vercel (Python) | Hobby (free) |
| MongoDB | Hosted at 10.60.184.61:27017 | Provided |

## 3. Vercel Setup

### 3.1 apps/web/vercel.json
```json
{
  "builds": [
    { "src": "package.json", "use": "@vercel/next" }
  ],
  "routes": [
    { "src": "/api/socket.io(.*)", "dest": "http://localhost:3001/api/socket.io$1" },
    { "src": "/api/(.*)", "dest": "http://localhost:3001/api/$1" }
  ]
}
```

### 3.2 apps/api/vercel.json
```json
{
  "builds": [
    { "src": "package.json", "use": "@vercel/python" }
  ],
  "routes": [
    { "src": "/(.*)", "dest": "main.py" }
  ]
}
```

## 4. Environment Variables

### 4.1 Vercel Dashboard — apps/web
```
NEXT_PUBLIC_API_URL=https://api.caro-phonel.vercel.app
NEXT_PUBLIC_WS_URL=wss://api.caro-phonel.vercel.app
```

### 4.2 Vercel Dashboard — apps/api
```
MONGODB_URI=mongodb://10.60.184.61:27017
DATABASE_NAME=carophil
DEBUG=false
```

## 5. GitHub Integration

### 5.1 Git Remote
```
origin: https://github.com/mjnhlyxa/caro-phonel.git
```

### 5.2 Vercel App Setup
1. Connect GitHub repo to Vercel
2. Configure root directory: `apps/web` for frontend, `apps/api` for backend
3. Enable auto-deploy on push to main branch
4. Set environment variables in Vercel dashboard

## 6. MongoDB Connection

```
Host: 10.60.184.61
Port: 27017
Database: carophil
Connection: via PyMongo (synchronous for MVP)
Pool size: 10 connections
```

## 7. Domain Configuration

- Frontend: `https://caro-phonel.vercel.app`
- Backend API: `https://api.caro-phonel.vercel.app`
- WebSocket: `wss://api.caro-phonel.vercel.app` (via Socket.IO)

## 8. Monitoring

- Vercel Analytics (built-in)
- Server logs via Vercel CLI: `vercel logs`
- MongoDB Atlas dashboard for database metrics
