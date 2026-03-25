'use client';

import { useState } from 'react';
import { useGame } from '@/hooks/useGame';
import { Board } from '@/components/Board';
import { GameStatus } from '@/components/GameStatus';
import { LevelBar } from '@/components/LevelBar';
import { Button } from '@/components/Button';
import { IntroScreen } from '@/components/IntroScreen';
import { SessionEndScreen } from '@/components/SessionEndScreen';
import { GAMES_PER_SESSION } from '@/lib/game';
import styles from './page.module.scss';

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
      <main className={styles.main}>
        <IntroScreen
          bestDifficulty={bestDifficulty}
          onStart={() => setStarted(true)}
        />
      </main>
    );
  }

  if (isSessionEnd) {
    return (
      <main className={styles.main}>
        <SessionEndScreen
          difficulty={difficulty}
          bestDifficulty={bestDifficulty}
          isNewBest={difficulty >= bestDifficulty}
          onPlayAgain={() => newSession()}
        />
      </main>
    );
  }

  const showNextButton = result && currentGame < GAMES_PER_SESSION;

  return (
    <main className={styles.main}>
      <div className={styles.game}>
        <div className={styles.header}>
          <h1 className={styles.title}>Tic Tac Toe</h1>
          <p className={styles.subtitle}>
            Game {currentGame} of {GAMES_PER_SESSION}
          </p>
        </div>

        <div className={styles.levelBarWrapper}>
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

        <div className={styles.buttonSlot}>
          {showNextButton && (
            <Button onClick={nextGame}>Next Game</Button>
          )}
        </div>
      </div>
    </main>
  );
}
