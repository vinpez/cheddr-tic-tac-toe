'use client';

import type { Board as BoardType, WinInfo } from '@/lib/game';
import { Cell } from './Cell';
import styles from './Board.module.scss';

interface BoardProps {
  board: BoardType;
  winInfo: WinInfo | null;
  onCellClick: (index: number) => void;
  disabled: boolean;
}

export function Board({ board, winInfo, onCellClick, disabled }: BoardProps) {
  const winningCells = new Set(winInfo?.line);

  return (
    <div className={styles.Board}>
      {board.map((cell, i) => (
        <Cell
          key={i}
          value={cell}
          onClick={() => onCellClick(i)}
          disabled={disabled}
          isWinning={winningCells.has(i)}
        />
      ))}
    </div>
  );
}
