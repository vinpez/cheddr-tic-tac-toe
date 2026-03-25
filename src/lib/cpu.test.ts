import { describe, it, expect } from 'vitest';
import { getCpuMove } from './cpu';
import { checkWinner, isBoardFull, createBoard, type Board } from './game';

function playRandomGame(): 'X' | 'O' | 'draw' {
  const board = createBoard();
  let isHumanTurn = true;
  const available = () => board.reduce<number[]>((m, c, i) => { if (c === null) m.push(i); return m; }, []);

  while (!checkWinner(board) && !isBoardFull(board)) {
    if (isHumanTurn) {
      const moves = available();
      board[moves[Math.floor(Math.random() * moves.length)]] = 'X';
    } else {
      const move = getCpuMove(board, 100);
      board[move] = 'O';
    }
    isHumanTurn = !isHumanTurn;
  }

  const winner = checkWinner(board);
  if (!winner) return 'draw';
  return winner.winner;
}

describe('getCpuMove', () => {
  it('returns a valid move index', () => {
    const board = createBoard();
    const move = getCpuMove(board, 50);
    expect(move).toBeGreaterThanOrEqual(0);
    expect(move).toBeLessThan(9);
    expect(board[move]).toBeNull();
  });

  it('does not mutate the original board', () => {
    const board: Board = [
      'X', null, null,
      null, 'O', null,
      null, null, null,
    ];
    const copy = [...board];
    getCpuMove(board, 50);
    expect(board).toEqual(copy);
  });

  it('takes an immediate win at high difficulty', () => {
    const board: Board = [
      'O', 'O', null,
      'X', 'X', null,
      null, null, null,
    ];
    const move = getCpuMove(board, 100);
    expect(move).toBe(2);
  });

  it('blocks an immediate opponent win at high difficulty', () => {
    const board: Board = [
      'X', 'X', null,
      'O', null, null,
      null, null, null,
    ];
    const move = getCpuMove(board, 100);
    expect(move).toBe(2);
  });

  it('is unbeatable at difficulty 100 over many random games', () => {
    let humanWins = 0;
    const rounds = 200;

    for (let i = 0; i < rounds; i++) {
      if (playRandomGame() === 'X') humanWins++;
    }

    expect(humanWins).toBe(0);
  });

  it('picks from available moves at low difficulty', () => {
    const board: Board = [
      'X', 'O', 'X',
      'O', 'X', 'O',
      null, null, null,
    ];
    const move = getCpuMove(board, 0);
    expect([6, 7, 8]).toContain(move);
  });
});
