import { Cell, CellStyles, CellType } from "./cell";

export type Graph = {
  startCell: Cell | undefined;
  finishCell: Cell | undefined;
  graph: Cell[][];
};

export enum GraphAlgorithms {
  Dijkstra = "Dijkstra",
  Astar = "A*",
}

export enum GraphActions {
  SetGraph,
  UpdateCell,
  InitializeGraph,
}

export interface SetGraphPayload {
  graph: Cell[][];
}

export interface UpdateGraphPayload {
  row: number;
  col: number;
  style: CellStyles;
  cellType: CellType;
}

interface InitializeGraphPayload {
  rows: number;
  columns: number;
}

export type GraphAction =
  | {
      type: GraphActions.SetGraph;
      payload: SetGraphPayload;
    }
  | {
      type: GraphActions.UpdateCell;
      payload: UpdateGraphPayload;
    }
  | {
      type: GraphActions.InitializeGraph;
      payload: InitializeGraphPayload;
    };

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
          g: 0,
          h: 0,
          f: 0,
          parent: undefined,
          isOnOpenList: undefined,
          isOnClosedList: undefined,
        });
      }
      res.push(row);
    }
    return res;
  }

  static generateAllWallGraph(rows: number, cols: number): Cell[][] {
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
          cellType: CellType.Wall,
          cellStyle: CellStyles.Wall,
          g: 0,
          h: 0,
          f: 0,
          parent: undefined,
          isOnOpenList: undefined,
          isOnClosedList: undefined,
        });
      }
      res.push(row);
    }
    return res;
  }

  static getCell(graph: Graph, row: number, col: number): Cell {
    if (
      !(
        graph &&
        graph.graph.length > 0 &&
        row >= 0 &&
        row < graph.graph.length &&
        col >= 0 &&
        col < graph.graph[0].length
      )
    ) {
      throw new Error("Invalid row or column index");
    }
    return graph.graph[row][col];
  }

  static getNeighbors(graph: Graph, cell: Cell): Cell[] {
    const neighbors: Cell[] = [];

    // Example: Check top, bottom, left, and right neighbors
    if (
      cell.posRow > 0 &&
      graph.graph[cell.posRow - 1][cell.posCol].cellType !== CellType.Wall
    ) {
      neighbors.push(GraphHelper.getCell(graph, cell.posRow - 1, cell.posCol));
    }
    if (
      cell.posRow < graph.graph.length - 1 &&
      graph.graph[cell.posRow + 1][cell.posCol].cellType !== CellType.Wall
    ) {
      neighbors.push(GraphHelper.getCell(graph, cell.posRow + 1, cell.posCol));
    }
    if (
      cell.posCol > 0 &&
      graph.graph[cell.posRow][cell.posCol - 1].cellType !== CellType.Wall
    ) {
      neighbors.push(GraphHelper.getCell(graph, cell.posRow, cell.posCol - 1));
    }
    if (
      cell.posCol < graph.graph[cell.posRow].length - 1 &&
      graph.graph[cell.posRow][cell.posCol + 1].cellType !== CellType.Wall
    ) {
      neighbors.push(GraphHelper.getCell(graph, cell.posRow, cell.posCol + 1));
    }

    return neighbors;
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

    return distance2 - distance1;
  }
}
