'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import {
  type Board,
  type GameResult,
  type WinInfo,
  type PlayerStats,
  createBoard,
  checkWinner,
  isBoardFull,
  GAMES_PER_SESSION,
  INITIAL_DIFFICULTY,
} from '@/lib/game';
import { getCpuMove } from '@/lib/cpu';

const STORAGE_KEY = 'ttt-stats';
const DEFAULT_STATS: PlayerStats = { difficulty: INITIAL_DIFFICULTY, streak: 0 };

function loadStats(): PlayerStats {
  if (typeof window === 'undefined') return DEFAULT_STATS;
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '');
    return {
      difficulty: Math.min(100, Math.max(0, Number(data.difficulty) || INITIAL_DIFFICULTY)),
      streak: Math.max(0, Number(data.streak) || 0),
    };
  } catch {
    return DEFAULT_STATS;
  }
}

function saveStats(stats: PlayerStats): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
  } catch {}
}

export function useGame() {
  const [board, setBoard] = useState<Board>(createBoard);
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [result, setResult] = useState<GameResult>(null);
  const [winInfo, setWinInfo] = useState<WinInfo | null>(null);
  const [cpuThinking, setCpuThinking] = useState(false);
  const [stats, setStats] = useState<PlayerStats>(DEFAULT_STATS);
  const [currentGame, setCurrentGame] = useState(1);
  const cpuTimeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    setStats(loadStats());
  }, []);

  const isSessionEnd = result !== null && currentGame >= GAMES_PER_SESSION;

  const applyResult = useCallback((r: 'win' | 'loss' | 'draw') => {
    setStats(prev => {
      let nextDifficulty = prev.difficulty;
      let nextStreak = prev.streak;

      if (r === 'win') {
        nextDifficulty = prev.difficulty + (100 - prev.difficulty) / 2;
        nextStreak = prev.streak + 1;
      } else if (r === 'loss') {
        nextDifficulty = prev.difficulty / 2;
        nextStreak = 0;
      }

      const next = { difficulty: nextDifficulty, streak: nextStreak };
      saveStats(next);
      return next;
    });
  }, []);

  const handleCpuMove = useCallback(
    (currentBoard: Board) => {
      setCpuThinking(true);
      const delay = 300 + Math.random() * 300;

      cpuTimeoutRef.current = setTimeout(() => {
        const move = getCpuMove(currentBoard, stats.difficulty);
        const nextBoard = [...currentBoard];
        nextBoard[move] = 'O';
        setBoard(nextBoard);
        setCpuThinking(false);

        const winner = checkWinner(nextBoard);
        if (winner) {
          setWinInfo(winner);
          setResult('loss');
          applyResult('loss');
        } else if (isBoardFull(nextBoard)) {
          setResult('draw');
          applyResult('draw');
        } else {
          setIsPlayerTurn(true);
        }
      }, delay);
    },
    [stats.difficulty, applyResult],
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
        applyResult('win');
        return;
      }

      if (isBoardFull(nextBoard)) {
        setResult('draw');
        applyResult('draw');
        return;
      }

      setIsPlayerTurn(false);
      handleCpuMove(nextBoard);
    },
    [board, isPlayerTurn, result, cpuThinking, handleCpuMove, applyResult],
  );

  const resetBoard = useCallback(() => {
    if (cpuTimeoutRef.current) clearTimeout(cpuTimeoutRef.current);
    setBoard(createBoard());
    setIsPlayerTurn(true);
    setResult(null);
    setWinInfo(null);
    setCpuThinking(false);
  }, []);

  const nextGame = useCallback(() => {
    resetBoard();
    setCurrentGame(g => g + 1);
  }, [resetBoard]);

  const newSession = useCallback(() => {
    resetBoard();
    setCurrentGame(1);
  }, [resetBoard]);

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
    cpuThinking,
    difficulty: stats.difficulty,
    streak: stats.streak,
    currentGame,
    isSessionEnd,
    makeMove,
    nextGame,
    newSession,
  };
}
