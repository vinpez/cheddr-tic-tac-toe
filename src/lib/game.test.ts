import { describe, it, expect } from 'vitest';
import {
  createBoard,
  checkWinner,
  isBoardFull,
  getAvailableMoves,
  getDifficultyLabel,
  type Board,
} from './game';

describe('createBoard', () => {
  it('returns a 9-element array of nulls', () => {
    const board = createBoard();
    expect(board).toHaveLength(9);
    expect(board.every(cell => cell === null)).toBe(true);
  });
});

describe('checkWinner', () => {
  it('returns null for an empty board', () => {
    expect(checkWinner(createBoard())).toBeNull();
  });

  it('detects a row win', () => {
    const board: Board = [
      'X', 'X', 'X',
      'O', 'O', null,
      null, null, null,
    ];
    const result = checkWinner(board);
    expect(result).toEqual({ winner: 'X', line: [0, 1, 2] });
  });

  it('detects a column win', () => {
    const board: Board = [
      'O', 'X', null,
      'O', 'X', null,
      'O', null, null,
    ];
    const result = checkWinner(board);
    expect(result).toEqual({ winner: 'O', line: [0, 3, 6] });
  });

  it('detects a diagonal win', () => {
    const board: Board = [
      'X', 'O', null,
      null, 'X', 'O',
      null, null, 'X',
    ];
    const result = checkWinner(board);
    expect(result).toEqual({ winner: 'X', line: [0, 4, 8] });
  });

  it('detects the anti-diagonal win', () => {
    const board: Board = [
      null, null, 'O',
      null, 'O', 'X',
      'O', 'X', null,
    ];
    const result = checkWinner(board);
    expect(result).toEqual({ winner: 'O', line: [2, 4, 6] });
  });

  it('returns null for an incomplete game', () => {
    const board: Board = [
      'X', 'O', 'X',
      null, 'X', 'O',
      'O', null, null,
    ];
    expect(checkWinner(board)).toBeNull();
  });

  it('returns null for a drawn board', () => {
    const board: Board = [
      'X', 'O', 'X',
      'X', 'O', 'O',
      'O', 'X', 'X',
    ];
    expect(checkWinner(board)).toBeNull();
  });
});

describe('isBoardFull', () => {
  it('returns false for an empty board', () => {
    expect(isBoardFull(createBoard())).toBe(false);
  });

  it('returns false for a partially filled board', () => {
    const board: Board = [
      'X', null, null,
      null, 'O', null,
      null, null, null,
    ];
    expect(isBoardFull(board)).toBe(false);
  });

  it('returns true for a full board', () => {
    const board: Board = [
      'X', 'O', 'X',
      'X', 'O', 'O',
      'O', 'X', 'X',
    ];
    expect(isBoardFull(board)).toBe(true);
  });
});

describe('getAvailableMoves', () => {
  it('returns all indices for an empty board', () => {
    expect(getAvailableMoves(createBoard())).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8]);
  });

  it('returns only empty cell indices', () => {
    const board: Board = [
      'X', 'O', 'X',
      null, 'O', null,
      'O', null, 'X',
    ];
    expect(getAvailableMoves(board)).toEqual([3, 5, 7]);
  });

  it('returns an empty array for a full board', () => {
    const board: Board = [
      'X', 'O', 'X',
      'X', 'O', 'O',
      'O', 'X', 'X',
    ];
    expect(getAvailableMoves(board)).toEqual([]);
  });
});

describe('getDifficultyLabel', () => {
  it('returns Beginner for 0', () => {
    expect(getDifficultyLabel(0)).toBe('Beginner');
  });

  it('returns Novice for 20', () => {
    expect(getDifficultyLabel(20)).toBe('Novice');
  });

  it('returns Intermediate for 40', () => {
    expect(getDifficultyLabel(40)).toBe('Intermediate');
  });

  it('returns Advanced for 55', () => {
    expect(getDifficultyLabel(55)).toBe('Advanced');
  });

  it('returns Expert for 70', () => {
    expect(getDifficultyLabel(70)).toBe('Expert');
  });

  it('returns Master for 85', () => {
    expect(getDifficultyLabel(85)).toBe('Master');
  });

  it('returns Master for 100', () => {
    expect(getDifficultyLabel(100)).toBe('Master');
  });

  it('returns Beginner for negative values', () => {
    expect(getDifficultyLabel(-5)).toBe('Beginner');
  });
});
