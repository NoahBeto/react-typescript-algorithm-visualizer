import { ECellType } from "../enums/cell.enums";

export type TCell = {
  posRow: number;
  posCol: number;
  cellType: ECellType;
};
