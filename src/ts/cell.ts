import { CellType } from "./enums/cell.enums";

export class Cell {
  posRow: number;
  posCol: number;
  cellType: CellType;

  constructor(posRow: number, posCol: number, cellType: CellType) {
    this.posRow = posRow;
    this.posCol = posCol;
    this.cellType = cellType;
  }
}
