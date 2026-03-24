'use client';

import type { Board as BoardType, WinInfo } from '@/lib/game';
import { Cell } from './Cell';

interface BoardProps {
  board: BoardType;
  winInfo: WinInfo | null;
  onCellClick: (index: number) => void;
  disabled: boolean;
}

export function Board({ board, winInfo, onCellClick, disabled }: BoardProps) {
  const winningCells = new Set(winInfo?.line);

  return (
    <div className="grid grid-cols-3 gap-3 w-full max-w-[320px] mx-auto">
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
