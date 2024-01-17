import { TCell } from "./types/Cell.types";
import { EGenericCellType } from "./types/GenericCell.types";

export const generateMaze = (
  rows: number,
  cols: number
): { maze: TCell[][]; steps: TCell[] } => {
  const maze: TCell[][] = [];

  // Initialize maze with walls
  for (let i = 0; i < rows; i++) {
    const row: TCell[] = [];
    for (let j = 0; j < cols; j++) {
      row.push({
        posRow: i,
        posCol: j,
        cellType: EGenericCellType.WALL,
      });
    }
    maze.push(row);
  }

  const getRandomIntInclusive = (min: number, max: number): number => {
    // The maximum is inclusive and the minimum is inclusive
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  // Generate random row and column indices
  const randomRowIndex = getRandomIntInclusive(1, rows - 2);
  const randomColIndex = getRandomIntInclusive(1, cols - 2);

  // chose a starting cell
  const startCell = maze[randomRowIndex][randomColIndex];
  startCell.cellType = EGenericCellType.NORMAL;

  // recursive backtracking
  const steps: TCell[] = [];
  recursiveBacktrack(maze, startCell, steps);

  return { maze, steps };
};

const recursiveBacktrack = (
  maze: TCell[][],
  currentCell: TCell,
  steps: TCell[]
) => {
  const neighbors = getNeighbors(maze, currentCell);

  // shuffle neighbors randomly
  neighbors.sort(() => Math.random() - 0.5);

  for (const neighbor of neighbors) {
    const { posRow, posCol } = neighbor;

    if (maze[posRow][posCol].cellType === EGenericCellType.WALL) {
      maze[posRow][posCol].cellType = EGenericCellType.NORMAL;

      // Carve a path between the current cell and the neighbor
      maze[(posRow + currentCell.posRow) / 2][
        (posCol + currentCell.posCol) / 2
      ].cellType = EGenericCellType.NORMAL;

      steps.push(currentCell);
      steps.push(
        maze[(posRow + currentCell.posRow) / 2][
          (posCol + currentCell.posCol) / 2
        ]
      );
      steps.push(maze[posRow][posCol]);

      recursiveBacktrack(maze, maze[posRow][posCol], steps);
    }
  }
};

const getNeighbors = (maze: TCell[][], cell: TCell): TCell[] => {
  const neighbors: TCell[] = [];

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

const isValidPathCandidate = (maze: TCell[][], cell: TCell): boolean => {
  return (
    cell.posRow >= 0 &&
    cell.posRow < maze.length &&
    cell.posCol >= 0 &&
    cell.posCol < maze[0].length &&
    maze[cell.posRow][cell.posCol].cellType === EGenericCellType.WALL
  );
};
