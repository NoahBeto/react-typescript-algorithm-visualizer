import { PriorityQueue } from "./helper";

export class GraphHelper {
  static generateGraph(rows: number, cols: number): Cell[][] {
    if (rows <= 0 || cols <= 0) {
      throw new Error("Rows and cols must be positive integers");
    }
    let res: Cell[][] = [];

    for (let i = 0; i < rows; i++) {
      let row: Cell[] = [];
      for (let j = 0; j < cols; j++) {
        row.push({
          posRow: i,
          posCol: j,
          cellType: CellType.Normal,
          cellStyle: CellStyles.Normal,
        });
      }
      res.push(row);
    }
    return res;
  }

  static getCell(graph: GraphType, row: number, col: number): Cell {
    if (
      !(
        graph &&
        graph.length > 0 &&
        row >= 0 &&
        row < graph.length &&
        col >= 0 &&
        col < graph[0].length
      )
    ) {
      throw new Error("Invalid row or column index");
    }
    return graph[row][col];
  }

  static dijkstra(graph: GraphType, start: Cell): { [key: string]: number } {
    const distances: { [key: string]: number } = {};
    const visited: { [key: string]: boolean } = {};
    const priorityQueue = new PriorityQueue<Cell>();

    // initialize all cells with distance infinity and visited false
    for (let row = 0; row < graph.length; row++) {
      for (let col = 0; col < graph[row].length; col++) {
        const cell = GraphHelper.getCell(graph, row, col);

        distances[`${cell.posRow}-${cell.posCol}`] = Infinity;
        visited[`${cell.posRow}-${cell.posCol}`] = false;
      }
    }

    // set start cell properties according to dijkstra
    distances[`${start.posRow}-${start.posCol}`] = 0;
    priorityQueue.enqueue(start, 0);

    while (!priorityQueue.isEmpty()) {
      const currentCell: Cell = priorityQueue.dequeue();

      if (visited[`${currentCell.posRow}-${currentCell.posCol}`]) continue;
      visited[`${currentCell.posRow}-${currentCell.posCol}`] = true;

      for (const neighbor of this.getNeighbors(graph, currentCell)) {
        const newDistance =
          distances[`${currentCell.posRow}-${currentCell.posCol}`] + 1;
        if (newDistance < distances[`${neighbor.posRow}-${neighbor.posCol}`]) {
          distances[`${neighbor.posRow}-${neighbor.posCol}`] = newDistance;
          priorityQueue.enqueue(neighbor, newDistance);
        }
      }
    }

    return distances;
  }

  private static getNeighbors(graph: GraphType, cell: Cell): Cell[] {
    const neighbors: Cell[] = [];

    // Example: Check top, bottom, left, and right neighbors
    if (cell.posRow > 0) {
      neighbors.push(GraphHelper.getCell(graph, cell.posRow - 1, cell.posCol));
    }
    if (cell.posRow < graph.length - 1) {
      neighbors.push(GraphHelper.getCell(graph, cell.posRow + 1, cell.posCol));
    }
    if (cell.posCol > 0) {
      neighbors.push(GraphHelper.getCell(graph, cell.posRow, cell.posCol - 1));
    }
    if (cell.posCol < graph[cell.posRow].length - 1) {
      neighbors.push(GraphHelper.getCell(graph, cell.posRow, cell.posCol + 1));
    }

    return neighbors;
  }

  static getPath(
    graph: GraphType,
    distances: { [key: string]: number },
    startCell: Cell,
    endCell: Cell
  ): Cell[] {
    const path: Cell[] = [];
    let currentCell = endCell;

    while (currentCell !== startCell) {
      path.unshift(currentCell);
      const neighbors = this.getNeighbors(graph, currentCell);

      const nextCell = neighbors.reduce((minDistanceCell, neighbor) => {
        const key = `${neighbor.posRow}-${neighbor.posCol}`;
        const neighborDistance = distances[key];

        if (
          neighborDistance <
          distances[`${minDistanceCell.posRow}-${minDistanceCell.posCol}`]
        ) {
          return neighbor;
        } else {
          return minDistanceCell;
        }
      }, neighbors[0]);
      currentCell = nextCell;
    }
    path.unshift(startCell);

    return path;
  }

  static getDistanceBetweenTwoCells(
    distances: { [key: string]: number },
    start: Cell,
    end: Cell
  ) {
    const key1 = `${start.posRow}-${start.posCol}`;
    const key2 = `${end.posRow}-${end.posCol}`;

    const distance1 = distances[key1];
    const distance2 = distances[key2];

    console.log(`start distance ${distance1} | end distance ${distance2}`);

    return distance2 - distance1;
  }
}

export type GraphType = Cell[][];

export class Cell {
  posRow: number;
  posCol: number;
  cellType: CellType;
  cellStyle: CellStyles;

  constructor(
    posRow: number,
    posCol: number,
    cellType: CellType,
    cellStyle: CellStyles
  ) {
    this.posRow = posRow;
    this.posCol = posCol;
    this.cellType = cellType;
    this.cellStyle = cellStyle;
  }
}

// The different types of Cells
export enum CellType {
  Normal,
  Wall,
  Start,
  Finish,
}

// These styles are defined in App.css
export enum CellStyles {
  Normal = "cell-normal",
  Start = "cell-start",
  Finish = "cell-finish",
  Highlight = "cell-highlight",
}

// Actions that can be used on the reducer
export enum CellActions {
  UpdateCell,
  InitializeGraph,
}

export type CellAction =
  | {
      type: CellActions.UpdateCell;
      payload: UpdateCellPayload;
    }
  | {
      type: CellActions.InitializeGraph;
      payload: InitializeGraphPayload;
    };

interface UpdateCellPayload {
  row: number;
  col: number;
  style: CellStyles;
}

interface InitializeGraphPayload {
  rows: number;
  columns: number;
}
