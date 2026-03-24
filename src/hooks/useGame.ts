'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import {
  type Board,
  type Difficulty,
  type GameResult,
  type WinInfo,
  type Scores,
  createBoard,
  checkWinner,
  isBoardFull,
} from '@/lib/game';
import { getCpuMove } from '@/lib/cpu';

const STORAGE_KEY = 'ttt-scores';
const DEFAULT_SCORES: Scores = { wins: 0, losses: 0, draws: 0 };

function loadScores(): Scores {
  if (typeof window === 'undefined') return DEFAULT_SCORES;
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '');
    return {
      wins: Number(data.wins) || 0,
      losses: Number(data.losses) || 0,
      draws: Number(data.draws) || 0,
    };
  } catch {
    return DEFAULT_SCORES;
  }
}

function saveScores(scores: Scores): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(scores));
  } catch {}
}

export function useGame() {
  const [board, setBoard] = useState<Board>(createBoard);
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [result, setResult] = useState<GameResult>(null);
  const [winInfo, setWinInfo] = useState<WinInfo | null>(null);
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [scores, setScores] = useState<Scores>(DEFAULT_SCORES);
  const [cpuThinking, setCpuThinking] = useState(false);
  const cpuTimeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    setScores(loadScores());
  }, []);

  const addScore = useCallback((r: 'win' | 'loss' | 'draw') => {
    setScores(prev => {
      const next: Scores = {
        wins: prev.wins + (r === 'win' ? 1 : 0),
        losses: prev.losses + (r === 'loss' ? 1 : 0),
        draws: prev.draws + (r === 'draw' ? 1 : 0),
      };
      saveScores(next);
      return next;
    });
  }, []);

  const handleCpuMove = useCallback(
    (currentBoard: Board) => {
      setCpuThinking(true);
      const delay = 300 + Math.random() * 300;

      cpuTimeoutRef.current = setTimeout(() => {
        const move = getCpuMove(currentBoard, difficulty);
        const nextBoard = [...currentBoard];
        nextBoard[move] = 'O';
        setBoard(nextBoard);
        setCpuThinking(false);

        const winner = checkWinner(nextBoard);
        if (winner) {
          setWinInfo(winner);
          setResult('loss');
          addScore('loss');
        } else if (isBoardFull(nextBoard)) {
          setResult('draw');
          addScore('draw');
        } else {
          setIsPlayerTurn(true);
        }
      }, delay);
    },
    [difficulty, addScore],
  );

  const makeMove = useCallback(
    (index: number) => {
      if (!isPlayerTurn || result || board[index] || cpuThinking) return;

      const nextBoard = [...board];
      nextBoard[index] = 'X';
      setBoard(nextBoard);

      const winner = checkWinner(nextBoard);
      if (winner) {
        setWinInfo(winner);
        setResult('win');
        addScore('win');
        return;
      }

      if (isBoardFull(nextBoard)) {
        setResult('draw');
        addScore('draw');
        return;
      }

      setIsPlayerTurn(false);
      handleCpuMove(nextBoard);
    },
    [board, isPlayerTurn, result, cpuThinking, handleCpuMove, addScore],
  );

  const resetGame = useCallback(() => {
    if (cpuTimeoutRef.current) clearTimeout(cpuTimeoutRef.current);
    setBoard(createBoard());
    setIsPlayerTurn(true);
    setResult(null);
    setWinInfo(null);
    setCpuThinking(false);
  }, []);

  const changeDifficulty = useCallback(
    (d: Difficulty) => {
      setDifficulty(d);
      resetGame();
    },
    [resetGame],
  );

  useEffect(() => {
    return () => {
      if (cpuTimeoutRef.current) clearTimeout(cpuTimeoutRef.current);
    };
  }, []);

  return {
    board,
    isPlayerTurn,
    result,
    winInfo,
    difficulty,
    scores,
    cpuThinking,
    makeMove,
    resetGame,
    changeDifficulty,
  };
}
