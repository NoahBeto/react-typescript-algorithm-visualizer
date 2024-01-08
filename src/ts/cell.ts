import { PriorityQueue } from "./helper";

export class GraphHelper {
  static generateGraph(rows: number, cols: number): Cell[][] {
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

  static getCell(graph: GraphType, row: number, col: number): Cell | undefined {
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
      console.error("Invalid row or column index");
      return undefined;
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
        if (!cell) continue;

        distances[`${cell.posRow}-${cell.posCol}`] = Infinity;
        visited[`${cell.posRow}-${cell.posCol}`] = false;
      }
    }

    // set start cell properties according to dijkstra
    distances[`${start.posRow}-${start.posCol}`] = 0;
    priorityQueue.enqueue(start, 0);

    while (!priorityQueue.isEmpty()) {
      const currentCell: Cell | undefined = priorityQueue.dequeue();
      if (!currentCell) continue;

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

  static getNeighbors(graph: GraphType, cell: Cell): Cell[] {
    const neighbors: Cell[] = [];

    // Example: Check top, bottom, left, and right neighbors
    if (cell.posRow > 0) {
      const topNeighbor = GraphHelper.getCell(
        graph,
        cell.posRow - 1,
        cell.posCol
      );
      if (topNeighbor) neighbors.push(topNeighbor);
    }
    if (cell.posRow < graph.length - 1) {
      const bottomNeighbor = GraphHelper.getCell(
        graph,
        cell.posRow + 1,
        cell.posCol
      );
      if (bottomNeighbor) neighbors.push(bottomNeighbor);
    }
    if (cell.posCol > 0) {
      const leftNeighbor = GraphHelper.getCell(
        graph,
        cell.posRow,
        cell.posCol - 1
      );
      if (leftNeighbor) neighbors.push(leftNeighbor);
    }
    if (cell.posCol < graph[cell.posRow].length - 1) {
      const rightNeighbor = GraphHelper.getCell(
        graph,
        cell.posRow,
        cell.posCol + 1
      );
      if (rightNeighbor) neighbors.push(rightNeighbor);
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
}

// Actions that can be used on the reducer
export enum CellActions {
  UpdateCell,
  InitializeGrid,
}
