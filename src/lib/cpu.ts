import type { Board, Difficulty } from './game';
import { checkWinner, getAvailableMoves, isBoardFull } from './game';

const CPU = 'O' as const;
const HUMAN = 'X' as const;

function randomMove(board: Board): number {
  const moves = getAvailableMoves(board);
  return moves[Math.floor(Math.random() * moves.length)];
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
  let bestMove = moves[0];

  for (const move of moves) {
    board[move] = CPU;
    const score = minimax(board, false, 0);
    board[move] = null;
    if (score > bestScore) {
      bestScore = score;
      bestMove = move;
    }
  }

  return bestMove;
}

function smartMove(board: Board): number {
  const moves = getAvailableMoves(board);

  for (const move of moves) {
    board[move] = CPU;
    if (checkWinner(board)) {
      board[move] = null;
      return move;
    }
    board[move] = null;
  }

  for (const move of moves) {
    board[move] = HUMAN;
    if (checkWinner(board)) {
      board[move] = null;
      return move;
    }
    board[move] = null;
  }

  if (Math.random() < 0.4) return randomMove(board);
  return minimaxMove(board);
}

/** Returns the index of the CPU's chosen move. Creates a working copy to avoid mutating the input. */
export function getCpuMove(board: Board, difficulty: Difficulty): number {
  const b = [...board];
  switch (difficulty) {
    case 'easy':
      return randomMove(b);
    case 'medium':
      return smartMove(b);
    case 'hard':
      return minimaxMove(b);
  }
}
