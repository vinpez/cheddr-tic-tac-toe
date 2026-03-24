export type Player = 'X' | 'O';
export type CellValue = Player | null;
export type Board = CellValue[];
export type GameResult = 'win' | 'loss' | 'draw' | null;

export interface WinInfo {
  winner: Player;
  line: number[];
}

export interface PlayerStats {
  level: number;
  streak: number;
}

export const MIN_LEVEL = 1;
export const MAX_LEVEL = 10;

const WINNING_LINES: readonly number[][] = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6],
];

export function createBoard(): Board {
  return Array(9).fill(null);
}

export function checkWinner(board: Board): WinInfo | null {
  for (const line of WINNING_LINES) {
    const [a, b, c] = line;
    const val = board[a];
    if (val && val === board[b] && val === board[c]) {
      return { winner: val, line };
    }
  }
  return null;
}

export function isBoardFull(board: Board): boolean {
  return board.every(cell => cell !== null);
}

export function getAvailableMoves(board: Board): number[] {
  return board.reduce<number[]>((moves, cell, i) => {
    if (cell === null) moves.push(i);
    return moves;
  }, []);
}
