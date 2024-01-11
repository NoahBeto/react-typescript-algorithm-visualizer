export class Cell {
  posRow: number;
  posCol: number;
  cellType: CellType;
  cellStyle: CellStyles;
  g: number;
  h: number;
  f: number;
  parent: Cell | undefined;
  isOnOpenList: boolean | undefined;
  isOnClosedList: boolean | undefined;

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
    this.g = 0;
    this.h = 0;
    this.f = 0;
    this.isOnOpenList = undefined;
    this.isOnClosedList = undefined;
  }
  // calculate the F value
  static calculateFValue = (cell: Cell): void => {
    cell.f = cell.g + cell.h;
  };

  // set the g value of the cell
  static setGValue = (cell: Cell, gValue: number): void => {
    cell.g = gValue;
    Cell.calculateFValue(cell);
  };

  // set the h value
  static setHValue = (cell: Cell, hValue: number): void => {
    cell.h = hValue;
    Cell.calculateFValue(cell);
  };

  // reset fgh values to zero
  static setFGHValuesToZero(cell: Cell): void {
    cell.f = cell.g = cell.h = 0;
  }
}

// The different types of Cells
export enum CellType {
  Normal,
  Wall,
  Start,
  Finish,
}

// These styles are defined in CellNode.css
export enum CellStyles {
  Normal = "cell-normal",
  Start = "cell-start",
  Finish = "cell-finish",
  Wall = "cell-wall",
  Highlight = "cell-highlight",
  SubtleHighlight = "cell-subtle-highlight",
}
