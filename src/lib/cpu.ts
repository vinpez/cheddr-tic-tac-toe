import type { Board, CellValue } from './game';
import { checkWinner, getAvailableMoves, isBoardFull } from './game';

const CPU = 'O' as const;
const HUMAN = 'X' as const;

function findWinningMove(board: Board, player: CellValue): number | null {
  for (const move of getAvailableMoves(board)) {
    board[move] = player;
    const wins = !!checkWinner(board);
    board[move] = null;
    if (wins) return move;
  }
  return null;
}

function minimax(board: Board, isMaximizing: boolean, depth: number): number {
  const winner = checkWinner(board);
  if (winner) return winner.winner === CPU ? 10 - depth : depth - 10;
  if (isBoardFull(board)) return 0;

  const moves = getAvailableMoves(board);

  if (isMaximizing) {
    let best = -Infinity;
    for (const move of moves) {
      board[move] = CPU;
      best = Math.max(best, minimax(board, false, depth + 1));
      board[move] = null;
    }
    return best;
  }

  let best = Infinity;
  for (const move of moves) {
    board[move] = HUMAN;
    best = Math.min(best, minimax(board, true, depth + 1));
    board[move] = null;
  }
  return best;
}

function scoredMove(board: Board, difficulty: number): number {
  const moves = getAvailableMoves(board);
  const scored = moves.map(move => {
    board[move] = CPU;
    const score = minimax(board, false, 0);
    board[move] = null;
    return { move, score };
  });

  scored.sort((a, b) => a.score - b.score);

  const target = (difficulty / 100) * (scored.length - 1);
  const offset = (Math.random() * 0.2 - 0.1) * scored.length;
  const index = Math.round(Math.min(scored.length - 1, Math.max(0, target + offset)));

  return scored[index].move;
}

/** Difficulty is 0–100. Higher = stronger CPU. */
export function getCpuMove(board: Board, difficulty: number): number {
  const b = [...board];

  if (difficulty >= 35) {
    const win = findWinningMove(b, CPU);
    if (win !== null) return win;
    const block = findWinningMove(b, HUMAN);
    if (block !== null) return block;
  }

  return scoredMove(b, difficulty);
}
