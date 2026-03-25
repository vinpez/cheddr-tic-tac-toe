import type { Board, CellValue } from './game';
import { checkWinner, getAvailableMoves, isBoardFull } from './game';

const CPU = 'O' as const;
const HUMAN = 'X' as const;

function randomMove(board: Board): number {
  const moves = getAvailableMoves(board);
  return moves[Math.floor(Math.random() * moves.length)];
}

function findWinningMove(board: Board, player: CellValue): number | null {
  for (const move of getAvailableMoves(board)) {
    const next = [...board];
    next[move] = player;
    if (checkWinner(next)) return move;
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
      const next = [...board];
      next[move] = CPU;
      best = Math.max(best, minimax(next, false, depth + 1));
    }
    return best;
  }

  let best = Infinity;
  for (const move of moves) {
    const next = [...board];
    next[move] = HUMAN;
    best = Math.min(best, minimax(next, true, depth + 1));
  }
  return best;
}

function minimaxMove(board: Board): number {
  const moves = getAvailableMoves(board);
  let bestScore = -Infinity;
  let bestMoves: number[] = [];

  for (const move of moves) {
    const next = [...board];
    next[move] = CPU;
    const score = minimax(next, false, 0);
    if (score > bestScore) {
      bestScore = score;
      bestMoves = [move];
    } else if (score === bestScore) {
      bestMoves.push(move);
    }
  }

  return bestMoves[Math.floor(Math.random() * bestMoves.length)];
}

/** Difficulty is 0–100. Higher = stronger CPU. */
export function getCpuMove(board: Board, difficulty: number): number {
  const mistakeRate = 1 - difficulty / 100;

  if (difficulty >= 35) {
    const win = findWinningMove(board, CPU);
    if (win !== null) return win;
    const block = findWinningMove(board, HUMAN);
    if (block !== null) return block;
  }

  if (Math.random() < mistakeRate) return randomMove(board);
  return minimaxMove(board);
}
