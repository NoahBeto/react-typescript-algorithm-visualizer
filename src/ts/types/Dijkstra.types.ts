import { TCell } from "./Cell.types";
import { ECellType } from "../enums/cell.enums";

export type TDijkstraState = {
  selectedCellTypeToPlace: ECellType;
  distances: { [key: string]: number } | undefined;
  path: TCell[] | undefined;
  visited: TCell[] | undefined;
};
