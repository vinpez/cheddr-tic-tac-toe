# Tic Tac Toe

A single-player Tic Tac Toe web app with adaptive AI difficulty and session-based progression.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to play.

## Architecture

```
src/
├── lib/
│   ├── game.ts          # Pure game logic — no React, no side effects
│   └── cpu.ts           # CPU AI strategies (random → minimax, scaled by level)
├── hooks/
│   └── useGame.ts       # Game state management via custom hook
├── components/
│   ├── Board.tsx         # 3×3 grid layout
│   ├── Cell.tsx          # Individual cell (presentational)
│   ├── GameStatus.tsx    # Turn / round / session status display
│   ├── LevelBar.tsx      # Visual level progression (1–10)
│   ├── StreakBadge.tsx    # Win streak counter
│   └── ScoreBoard.tsx    # Session round score + progress
└── app/
    ├── layout.tsx
    ├── page.tsx          # Main game page (client component)
    └── globals.css       # Tailwind theme + animations
```

**Separation of concerns** — game logic (`lib/`) is pure TypeScript with no framework dependencies. React components are presentational. All state lives in a single `useGame` hook.

## AI Approach

Difficulty scales continuously across levels 1–10 using a single `mistakeRate` parameter:

- **Levels 1–3**: High mistake rate, mostly random moves — easy to beat
- **Levels 4–6**: Win/block checks first, then a mix of random and minimax — competitive but beatable
- **Levels 7–9**: Low mistake rate, mostly minimax — tough opponent
- **Level 10**: Pure minimax with depth-based scoring — unbeatable

The minimax algorithm evaluates every possible game state to find the optimal move. Depth is factored into scoring so the CPU prefers faster wins and delays losses. Lower levels introduce randomness to keep the game fun and winnable.

## Progression System

- **Sessions**: Each session is a best-of-5 series. Most round wins takes the session.
- **Adaptive difficulty**: Win a session → level up. Lose → level down. Draw → stay.
- **Win streaks**: Track consecutive session wins. Losses reset the streak; draws maintain it.
- **Persistence**: Level and streak are saved to localStorage.

## Tech Stack

- **Next.js** (App Router) + **React** + **TypeScript**
- **Tailwind CSS v4** for styling
- Deployed on **Vercel**

## Features

- Human (X) vs CPU (O)
- Adaptive difficulty (levels 1–10) with continuous scaling
- Best-of-5 session format with auto-advance between rounds
- Win streak tracking with milestone highlights
- Winning line highlight
- CPU thinking delay (300–600ms) with interaction prevention
- Clean, dark UI inspired by [cheddr.xyz](https://www.cheddr.xyz/)
