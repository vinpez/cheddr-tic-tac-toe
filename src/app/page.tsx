'use client';

import { useGame } from '@/hooks/useGame';
import { Board } from '@/components/Board';
import { GameStatus } from '@/components/GameStatus';
import { LevelBar } from '@/components/LevelBar';
import { StreakBadge } from '@/components/StreakBadge';
import { GAMES_PER_SESSION } from '@/lib/game';

export default function Home() {
  const {
    board,
    isPlayerTurn,
    result,
    winInfo,
    cpuThinking,
    difficulty,
    streak,
    currentGame,
    isSessionEnd,
    makeMove,
    nextGame,
    newSession,
  } = useGame();

  return (
    <main className="flex-1 flex items-center justify-center p-4">
      <div className="w-full max-w-sm flex flex-col items-center gap-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight">TIC TAC TOE</h1>
          <p className="text-secondary text-sm mt-1">
            Game {currentGame} of {GAMES_PER_SESSION}
          </p>
        </div>

        <div className="flex items-center gap-4 w-full">
          <LevelBar difficulty={difficulty} />
          <StreakBadge streak={streak} />
        </div>

        <Board
          board={board}
          winInfo={winInfo}
          onCellClick={makeMove}
          disabled={!isPlayerTurn || !!result || cpuThinking}
        />

        <GameStatus
          result={result}
          isPlayerTurn={isPlayerTurn}
          cpuThinking={cpuThinking}
          isSessionEnd={isSessionEnd}
          difficulty={difficulty}
        />

        {result && !isSessionEnd && (
          <button
            onClick={nextGame}
            className="px-6 py-2.5 rounded-lg font-medium transition-all duration-200 cursor-pointer bg-accent text-black hover:bg-accent-hover"
          >
            Next Game
          </button>
        )}

        {isSessionEnd && (
          <button
            onClick={newSession}
            className="px-6 py-2.5 rounded-lg font-medium transition-all duration-200 cursor-pointer bg-accent text-black hover:bg-accent-hover"
          >
            Play Again
          </button>
        )}
      </div>
    </main>
  );
}
