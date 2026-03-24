'use client';

import { useGame } from '@/hooks/useGame';
import { Board } from '@/components/Board';
import { GameStatus } from '@/components/GameStatus';
import { LevelBar } from '@/components/LevelBar';
import { StreakBadge } from '@/components/StreakBadge';

export default function Home() {
  const {
    board,
    isPlayerTurn,
    result,
    winInfo,
    cpuThinking,
    level,
    streak,
    levelDelta,
    makeMove,
    newGame,
  } = useGame();

  return (
    <main className="flex-1 flex items-center justify-center p-4">
      <div className="w-full max-w-sm flex flex-col items-center gap-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight">TIC TAC TOE</h1>
          <p className="text-secondary text-sm mt-1">You are X — beat the CPU</p>
        </div>

        <div className="flex items-center justify-between w-full">
          <LevelBar level={level} delta={levelDelta} />
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
          levelDelta={levelDelta}
        />

        {result && (
          <button
            onClick={newGame}
            className="px-6 py-2.5 rounded-lg font-medium transition-all duration-200 cursor-pointer bg-accent text-black hover:bg-accent-hover"
          >
            New Game
          </button>
        )}
      </div>
    </main>
  );
}
