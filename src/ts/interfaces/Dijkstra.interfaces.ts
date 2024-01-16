import { Cell } from "../cell";
import { ECellType } from "../enums/cell.enums";

export interface IDijkstraState {
  selectedCellTypeToPlace: ECellType;
  distances: { [key: string]: number } | undefined;
  path: Cell[] | undefined;
  visited: Cell[] | undefined;
}
