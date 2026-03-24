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

function minimaxMove(board: Board): number {
  const moves = getAvailableMoves(board);
  let bestScore = -Infinity;
  let bestMoves: number[] = [];

  for (const move of moves) {
    board[move] = CPU;
    const score = minimax(board, false, 0);
    board[move] = null;
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
  const b = [...board];
  const mistakeRate = 1 - difficulty / 100;

  if (difficulty >= 35) {
    const win = findWinningMove(b, CPU);
    if (win !== null) return win;
    const block = findWinningMove(b, HUMAN);
    if (block !== null) return block;
  }

  if (Math.random() < mistakeRate) return randomMove(b);
  return minimaxMove(b);
}
