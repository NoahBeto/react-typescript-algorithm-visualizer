import { ECellType } from "./enums/cell.enums";

export class Cell {
  posRow: number;
  posCol: number;
  cellType: ECellType;

  constructor(posRow: number, posCol: number, cellType: ECellType) {
    this.posRow = posRow;
    this.posCol = posCol;
    this.cellType = cellType;
  }
}
