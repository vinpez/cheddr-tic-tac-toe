'use client';

import { useState } from 'react';
import { useGame } from '@/hooks/useGame';
import { Board } from '@/components/Board';
import { GameStatus } from '@/components/GameStatus';
import { LevelBar } from '@/components/LevelBar';
import { GAMES_PER_SESSION, getDifficultyLabel } from '@/lib/game';

function IntroScreen({
  bestDifficulty,
  onStart,
}: {
  bestDifficulty: number;
  onStart: () => void;
}) {
  return (
    <div className="w-full max-w-sm flex flex-col items-center gap-12 text-center">
      <div>
        <h1 className="text-5xl font-black italic uppercase tracking-tight text-accent">
          Tic Tac Toe
        </h1>
      </div>

      <div className="flex flex-col gap-3 text-secondary text-sm leading-relaxed">
        <p>Play {GAMES_PER_SESSION} games against the CPU.</p>
        <p>
          Win to <span className="text-accent font-semibold">increase</span> the
          difficulty. Lose to{' '}
          <span className="text-rose-400 font-semibold">decrease</span> it.
        </p>
        <p className="text-foreground font-semibold">How high can you climb?</p>
      </div>

      {bestDifficulty > 0 && (
        <p className="text-secondary text-sm">
          Personal best:{' '}
          <span className="text-accent font-bold">
            {getDifficultyLabel(bestDifficulty)}
          </span>
        </p>
      )}

      <button
        onClick={onStart}
        className="px-10 py-3.5 rounded-full font-bold text-lg uppercase tracking-wide transition-all duration-200 cursor-pointer bg-accent text-black hover:bg-accent-hover"
      >
        Start
      </button>
    </div>
  );
}

function SessionEndScreen({
  difficulty,
  bestDifficulty,
  isNewBest,
  onPlayAgain,
}: {
  difficulty: number;
  bestDifficulty: number;
  isNewBest: boolean;
  onPlayAgain: () => void;
}) {
  return (
    <div className="w-full max-w-sm flex flex-col items-center gap-10 text-center">
      <div>
        <h1 className="text-5xl font-black italic uppercase tracking-tight text-accent">
          Tic Tac Toe
        </h1>
      </div>

      <div className="flex flex-col items-center gap-5">
        <p className="text-secondary text-xs font-bold uppercase tracking-widest">
          You reached
        </p>
        <p className="text-4xl font-black uppercase tracking-tight text-accent">
          {getDifficultyLabel(difficulty)}
        </p>
        <div className="w-full">
          <LevelBar difficulty={difficulty} />
        </div>
        {isNewBest ? (
          <p className="text-accent text-sm font-bold uppercase tracking-wide">
            New personal best!
          </p>
        ) : (
          <p className="text-secondary text-sm">
            Personal best:{' '}
            <span className="text-accent font-bold">
              {getDifficultyLabel(bestDifficulty)}
            </span>
          </p>
        )}
      </div>

      <button
        onClick={onPlayAgain}
        className="px-10 py-3.5 rounded-full font-bold text-lg uppercase tracking-wide transition-all duration-200 cursor-pointer bg-accent text-black hover:bg-accent-hover"
      >
        Play Again
      </button>
    </div>
  );
}

export default function Home() {
  const [started, setStarted] = useState(false);
  const {
    board,
    isPlayerTurn,
    result,
    winInfo,
    cpuThinking,
    difficulty,
    bestDifficulty,
    currentGame,
    isSessionEnd,
    makeMove,
    nextGame,
    newSession,
  } = useGame();

  if (!started) {
    return (
      <main className="flex-1 flex items-center justify-center p-4">
        <IntroScreen
          bestDifficulty={bestDifficulty}
          onStart={() => setStarted(true)}
        />
      </main>
    );
  }

  if (isSessionEnd) {
    return (
      <main className="flex-1 flex items-center justify-center p-4">
        <SessionEndScreen
          difficulty={difficulty}
          bestDifficulty={bestDifficulty}
          isNewBest={difficulty >= bestDifficulty}
          onPlayAgain={() => newSession()}
        />
      </main>
    );
  }

  return (
    <main className="flex-1 flex items-center justify-center p-4">
      <div className="w-full max-w-sm flex flex-col items-center gap-8">
        <div className="text-center">
          <h1 className="text-3xl font-black italic uppercase tracking-tight text-accent">
            Tic Tac Toe
          </h1>
          <p className="text-secondary text-xs font-bold uppercase tracking-widest mt-2">
            Game {currentGame} of {GAMES_PER_SESSION}
          </p>
        </div>

        <div className="w-full">
          <LevelBar difficulty={difficulty} />
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
          isSessionEnd={false}
          difficulty={difficulty}
        />

        {result && currentGame < GAMES_PER_SESSION && (
          <button
            onClick={nextGame}
            className="px-8 py-3 rounded-full font-bold uppercase tracking-wide transition-all duration-200 cursor-pointer bg-accent text-black hover:bg-accent-hover"
          >
            Next Game
          </button>
        )}
      </div>
    </main>
  );
}
