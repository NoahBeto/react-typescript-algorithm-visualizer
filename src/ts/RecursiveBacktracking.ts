import { Cell, CellStyles, CellType } from "./cell";

export const generateMaze = (rows: number, cols: number): Cell[][] => {
  const maze: Cell[][] = [];

  // Initialize maze with walls
  for (let i = 0; i < rows; i++) {
    const row: Cell[] = [];
    for (let j = 0; j < cols; j++) {
      row.push(new Cell(i, j, CellType.Wall, CellStyles.Wall));
    }
    maze.push(row);
  }

  // chose a starting cell
  const startCell = maze[15][15];
  startCell.cellType = CellType.Normal;
  startCell.cellStyle = CellStyles.Normal;

  // recursive backtracking
  recursiveBacktrack(maze, startCell);

  return maze;
};

const recursiveBacktrack = (maze: Cell[][], currentCell: Cell) => {
  const neighbors = getNeighbors(maze, currentCell);

  // shuffle neighbors randomly
  neighbors.sort(() => Math.random() - 0.5);

  for (const neighbor of neighbors) {
    const { posRow, posCol } = neighbor;

    if (maze[posRow][posCol].cellType === CellType.Wall) {
      maze[posRow][posCol].cellType = CellType.Normal;
      maze[posRow][posCol].cellStyle = CellStyles.Normal;

      // Carve a path between the current cell and the neighbor
      maze[(posRow + currentCell.posRow) / 2][
        (posCol + currentCell.posCol) / 2
      ].cellType = CellType.Normal;
      maze[(posRow + currentCell.posRow) / 2][
        (posCol + currentCell.posCol) / 2
      ].cellStyle = CellStyles.Normal;

      recursiveBacktrack(maze, maze[posRow][posCol]);
    }
  }
};

const getNeighbors = (maze: Cell[][], cell: Cell): Cell[] => {
  const neighbors: Cell[] = [];

  // Check top neighbor
  if (
    cell.posRow > 1 &&
    isValidPathCandidate(maze, maze[cell.posRow - 2][cell.posCol])
  ) {
    neighbors.push(maze[cell.posRow - 2][cell.posCol]);
  }

  // Check right neighbor
  if (
    cell.posCol < maze[0].length - 2 &&
    isValidPathCandidate(maze, maze[cell.posRow][cell.posCol + 2])
  ) {
    neighbors.push(maze[cell.posRow][cell.posCol + 2]);
  }

  // Check bottom neighbor
  if (
    cell.posRow < maze.length - 2 &&
    isValidPathCandidate(maze, maze[cell.posRow + 2][cell.posCol])
  ) {
    neighbors.push(maze[cell.posRow + 2][cell.posCol]);
  }

  // Check left neighbor
  if (
    cell.posCol > 1 &&
    isValidPathCandidate(maze, maze[cell.posRow][cell.posCol - 2])
  ) {
    neighbors.push(maze[cell.posRow][cell.posCol - 2]);
  }

  return neighbors;
};

const isValidPathCandidate = (maze: Cell[][], cell: Cell): boolean => {
  return (
    cell.posRow >= 0 &&
    cell.posRow < maze.length &&
    cell.posCol >= 0 &&
    cell.posCol < maze[0].length &&
    maze[cell.posRow][cell.posCol].cellType === CellType.Wall
  );
};
