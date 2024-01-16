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

// The different types of Cells
export enum CellType {
  Normal = "cell-normal",
  Wall = "cell-wall",
  Start = "cell-start",
  Finish = "cell-finish",
  Highlight = "cell-highlight",
  SubtleHighlight = "cell-subtle-highlight",
}
