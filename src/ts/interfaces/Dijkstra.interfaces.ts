import { Cell } from "../cell";
import { CellType } from "../enums/cell.enums";

export interface DijkstraState {
  selectedCellTypeToPlace: CellType;
  distances: { [key: string]: number } | undefined;
  path: Cell[] | undefined;
  visited: Cell[] | undefined;
}
