import { TCell } from "./types/Cell.types";
import { TGraph } from "./types/GraphHelper.types";
import { EGenericCellType } from "./types/GenericCell.types";

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
          cellType: EGenericCellType.NORMAL,
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
          cellType: EGenericCellType.WALL,
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
}
