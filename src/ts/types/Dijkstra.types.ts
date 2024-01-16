import { Cell } from "../cell";
import { ECellType } from "../enums/cell.enums";

export type TDijkstraState = {
  selectedCellTypeToPlace: ECellType;
  distances: { [key: string]: number } | undefined;
  path: Cell[] | undefined;
  visited: Cell[] | undefined;
}
