import { Cell } from "../cell";
import { ECellType } from "../enums/cell.enums";

export interface ISetGraphPayload {
  graph: Cell[][];
}
export interface IUpdateGraphPayload {
  row: number;
  col: number;
  cellType: ECellType;
}
export interface IInitializeGraphPayload {
  rows: number;
  columns: number;
}
