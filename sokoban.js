class SokobanSolver {
  constructor(board) {
    this.board = board;
    this.rows = board.length;
    this.cols = board[0].length;
  }

  solve() {
    const initialState = {
      board: this.board,
      player: this.findPlayerPosition(),
      path: [],
    };

    const queue = [initialState];
    const visited = new Set();

    while (queue.length > 0) {
      const currentState = queue.shift();

      if (this.isGoalState(currentState)) {
        return currentState.path;
      }

      const hash = this.hashState(currentState);
      if (visited.has(hash)) {
        continue;
      }

      visited.add(hash);

      const nextStates = this.generateNextStates(currentState);
      queue.push(...nextStates);
    }

    return null; // No solution found
  }

  findPlayerPosition() {
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        if (this.board[i][j] === 'P') {
          return { row: i, col: j };
        }
      }
    }
    return null; // Player not found
  }

  isGoalState(state) {
    // Check if all boxes are on target positions
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        if (state.board[i][j] === 'B' && this.board[i][j] !== 'T') {
          return false;
        }
      }
    }
    return true;
  }

  hashState(state) {
    // Generate a unique hash for a state to avoid revisiting
    return state.board.map(row => row.join('')).join('');
  }

  generateNextStates(state) {
    // console.log(state.board);
    const { row, col } = state.player;
    const directions = [{ row: -1, col: 0 }, { row: 1, col: 0 }, { row: 0, col: -1 }, { row: 0, col: 1 }];
    const nextStates = [];

    for (const dir of directions) {
      const newRow = row + dir.row;
      const newCol = col + dir.col;

      if (!this.isPlayerHittingWallOrTarget(newRow, newCol, state.board)) {
        if (this.isPlayerHittingBox(newRow, newCol, state.board)) {
          if (!this.isBoxHittingWall(newRow, newCol, dir, state.board)) {
            const newBoardAfterBoxMovement = this.moveBox(state.board, newRow, newCol, dir);

            const newBoard = this.movePlayer(newBoardAfterBoxMovement, row, col, newRow, newCol);
            const newPath = [...state.path, dir];
            const newPlayer = { row: newRow, col: newCol };
            
            nextStates.push({ board: newBoard, player: newPlayer, path: newPath });
          }
        } else {
          const newBoard = this.movePlayer(state.board, row, col, newRow, newCol);
          const newPath = [...state.path, dir];
          const newPlayer = { row: newRow, col: newCol };

          nextStates.push({ board: newBoard, player: newPlayer, path: newPath });
        }
      }
    }

    return nextStates;
  }

  isPlayerHittingWallOrTarget(playerNextRow, playerNextCol, board) {
    return board[playerNextRow][playerNextCol] === 'W' || board[playerNextRow][playerNextCol] === 'T';
  }

  isPlayerHittingBox(playerNextRow, playerNextCol, board) {
    return board[playerNextRow][playerNextCol] === 'B';
  }

  isBoxHittingWall(playerNextRow, playerNextCol, dir, board) {
    const boxNextRow = playerNextRow + dir.row;
    const boxNextCol = playerNextCol + dir.col;
    return board[boxNextRow][boxNextCol] === 'W';
  }

  movePlayer(board, fromRow, fromCol, toRow, toCol) {
    const newBoard = board.map(row => [...row]);
    newBoard[fromRow][fromCol] = '.';
    newBoard[toRow][toCol] = 'P';
    return newBoard;
  }

  moveBox(board, fromRow, fromCol, dir) {
    const newBoard = board.map(row => [...row]);
    const boxNextRow = fromRow + dir.row;
    const boxNextCol = fromCol + dir.col;
    newBoard[fromRow][fromCol] = '.';
    newBoard[boxNextRow][boxNextCol] = 'B';
    return newBoard;
  }
}

// Example usage
const board = [
  ['W', 'W', 'W', 'T', 'W'],
  ['W', '.', 'B', '.', 'W'],
  ['W', '.', 'P', '.', 'W'],
  ['W', '.', '.', '.', 'W'],
  ['W', 'W', 'W', 'W', 'W'],
];

const solver = new SokobanSolver(board);
const solution = solver.solve();

console.log(solution); // Array of moves (e.g., [{ row: -1, col: 0 }, { row: 0, col: 1 }, ...])
