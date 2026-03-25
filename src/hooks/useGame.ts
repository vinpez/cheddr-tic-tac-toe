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
const DEFAULT_STATS: PlayerStats = { bestDifficulty: 0 };

function loadStats(): PlayerStats {
  if (typeof window === 'undefined') return DEFAULT_STATS;
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '');
    return {
      bestDifficulty: Math.min(100, Math.max(0, Number(data.bestDifficulty) || 0)),
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
  const [difficulty, setDifficulty] = useState(INITIAL_DIFFICULTY);
  const [stats, setStats] = useState<PlayerStats>(DEFAULT_STATS);
  const [currentGame, setCurrentGame] = useState(1);
  const [showSessionEnd, setShowSessionEnd] = useState(false);
  const cpuTimeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const sessionEndTimeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    setStats(loadStats());
  }, []);

  const isLastGame = result !== null && currentGame >= GAMES_PER_SESSION;

  useEffect(() => {
    if (isLastGame) {
      if (difficulty > stats.bestDifficulty) {
        setStats(() => {
          const next = { bestDifficulty: difficulty };
          saveStats(next);
          return next;
        });
      }
      sessionEndTimeoutRef.current = setTimeout(() => {
        setShowSessionEnd(true);
      }, 2000);
    }
  }, [isLastGame, difficulty, stats.bestDifficulty]);

  const applyResult = useCallback((r: 'win' | 'loss' | 'draw') => {
    setDifficulty(prev => {
      if (r === 'win') return prev + Math.min(25, (100 - prev) / 2);
      if (r === 'loss') return prev - Math.min(25, prev / 2);
      return prev;
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
          applyResult('loss');
        } else if (isBoardFull(nextBoard)) {
          setResult('draw');
          applyResult('draw');
        } else {
          setIsPlayerTurn(true);
        }
      }, delay);
    },
    [difficulty, applyResult],
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
    if (sessionEndTimeoutRef.current) clearTimeout(sessionEndTimeoutRef.current);
    resetBoard();
    setCurrentGame(1);
    setDifficulty(INITIAL_DIFFICULTY);
    setShowSessionEnd(false);
  }, [resetBoard]);

  useEffect(() => {
    return () => {
      if (cpuTimeoutRef.current) clearTimeout(cpuTimeoutRef.current);
      if (sessionEndTimeoutRef.current) clearTimeout(sessionEndTimeoutRef.current);
    };
  }, []);

  return {
    board,
    isPlayerTurn,
    result,
    winInfo,
    cpuThinking,
    difficulty,
    bestDifficulty: stats.bestDifficulty,
    currentGame,
    isSessionEnd: showSessionEnd,
    makeMove,
    nextGame,
    newSession,
  };
}
