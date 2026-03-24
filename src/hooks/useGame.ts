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
  MIN_LEVEL,
  MAX_LEVEL,
} from '@/lib/game';
import { getCpuMove } from '@/lib/cpu';

const STORAGE_KEY = 'ttt-stats';
const DEFAULT_STATS: PlayerStats = { level: 1, streak: 0 };

function loadStats(): PlayerStats {
  if (typeof window === 'undefined') return DEFAULT_STATS;
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '');
    return {
      level: Math.min(MAX_LEVEL, Math.max(MIN_LEVEL, Number(data.level) || 1)),
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
  const [levelDelta, setLevelDelta] = useState(0);
  const cpuTimeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    setStats(loadStats());
  }, []);

  const applyResult = useCallback((r: 'win' | 'loss' | 'draw') => {
    setStats(prev => {
      let nextLevel = prev.level;
      let nextStreak = prev.streak;

      if (r === 'win') {
        nextLevel = Math.min(MAX_LEVEL, prev.level + 1);
        nextStreak = prev.streak + 1;
      } else if (r === 'loss') {
        nextLevel = Math.max(MIN_LEVEL, prev.level - 1);
        nextStreak = 0;
      }

      setLevelDelta(nextLevel - prev.level);
      const next = { level: nextLevel, streak: nextStreak };
      saveStats(next);
      return next;
    });
  }, []);

  const handleCpuMove = useCallback(
    (currentBoard: Board) => {
      setCpuThinking(true);
      const delay = 300 + Math.random() * 300;

      cpuTimeoutRef.current = setTimeout(() => {
        const move = getCpuMove(currentBoard, stats.level);
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
    [stats.level, applyResult],
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

  const newGame = useCallback(() => {
    if (cpuTimeoutRef.current) clearTimeout(cpuTimeoutRef.current);
    setBoard(createBoard());
    setIsPlayerTurn(true);
    setResult(null);
    setWinInfo(null);
    setCpuThinking(false);
    setLevelDelta(0);
  }, []);

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
    level: stats.level,
    streak: stats.streak,
    levelDelta,
    makeMove,
    newGame,
  };
}
