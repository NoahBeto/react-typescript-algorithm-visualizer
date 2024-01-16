import { Cell } from "../cell";
import { CellType } from "../enums/cell.enums";

export interface SetGraphPayload {
  graph: Cell[][];
}
export interface UpdateGraphPayload {
  row: number;
  col: number;
  cellType: CellType;
}
export interface InitializeGraphPayload {
  rows: number;
  columns: number;
}
