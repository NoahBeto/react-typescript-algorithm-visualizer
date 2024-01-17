import { GenericCell } from "../GenericCell";
import { EHeuristic } from "../enums/GenericGraph.enums";
import { TCoords } from "./GenericCell.types";
import { TGraph } from "./GraphHelper.types";

export type TGenericGraphConstructor = {
  importedGraph: TGraph;
  rows: number;
  cols: number;
  startCell?: GenericCell | undefined;
  finishCell?: GenericCell | undefined;
  diagonalAllowed?: boolean;
  heuristic?: EHeuristic;
  weight?: number;
  includeStartCell?: boolean;
  includeFinishCell?: boolean;
  allowPathAsCloseAsPossible?: boolean;
};

export type TGenericCellMatrix = GenericCell[][];
