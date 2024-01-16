import { TCell } from "./types/Cell.types";
import { ECellType } from "./enums/cell.enums";
import { TGraph } from "./types/GraphHelper.types";

export class GraphHelper {
  static generateGraph(rows: number, cols: number): TCell[][] {
    if (rows <= 0 || cols <= 0) {
      throw new Error("Rows and cols must be positive integers");
    }
    let res: TCell[][] = [];

    for (let i = 0; i < rows; i++) {
      let row: TCell[] = [];
      for (let j = 0; j < cols; j++) {
        row.push({
          posRow: i,
          posCol: j,
          cellType: ECellType.Normal,
        });
      }
      res.push(row);
    }
    return res;
  }

  static generateAllWallGraph(rows: number, cols: number): TCell[][] {
    if (rows <= 0 || cols <= 0) {
      throw new Error("Rows and cols must be positive integers");
    }
    let res: TCell[][] = [];

    for (let i = 0; i < rows; i++) {
      let row: TCell[] = [];
      for (let j = 0; j < cols; j++) {
        row.push({
          posRow: i,
          posCol: j,
          cellType: ECellType.Wall,
        });
      }
      res.push(row);
    }
    return res;
  }

  static getCell(graph: TGraph, row: number, col: number): TCell {
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

  static getNeighbors(graph: TGraph, cell: TCell): TCell[] {
    const neighbors: TCell[] = [];

    // Example: Check top, bottom, left, and right neighbors
    if (
      cell.posRow > 0 &&
      graph.graph[cell.posRow - 1][cell.posCol].cellType !== ECellType.Wall
    ) {
      neighbors.push(GraphHelper.getCell(graph, cell.posRow - 1, cell.posCol));
    }
    if (
      cell.posRow < graph.graph.length - 1 &&
      graph.graph[cell.posRow + 1][cell.posCol].cellType !== ECellType.Wall
    ) {
      neighbors.push(GraphHelper.getCell(graph, cell.posRow + 1, cell.posCol));
    }
    if (
      cell.posCol > 0 &&
      graph.graph[cell.posRow][cell.posCol - 1].cellType !== ECellType.Wall
    ) {
      neighbors.push(GraphHelper.getCell(graph, cell.posRow, cell.posCol - 1));
    }
    if (
      cell.posCol < graph.graph[cell.posRow].length - 1 &&
      graph.graph[cell.posRow][cell.posCol + 1].cellType !== ECellType.Wall
    ) {
      neighbors.push(GraphHelper.getCell(graph, cell.posRow, cell.posCol + 1));
    }

    return neighbors;
  }

  static getDistanceBetweenTwoCells(
    distances: { [key: string]: number },
    start: TCell,
    end: TCell
  ) {
    const key1 = `${start.posRow}-${start.posCol}`;
    const key2 = `${end.posRow}-${end.posCol}`;

    const distance1 = distances[key1];
    const distance2 = distances[key2];

    return distance2 - distance1;
  }
}
