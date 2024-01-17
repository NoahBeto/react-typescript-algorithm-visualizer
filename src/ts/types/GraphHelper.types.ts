import { TCell } from "./Cell.types";
import { EGraphActions } from "../enums/GraphHelper.enums";
import { EGenericCellType } from "./GenericCell.types";

export type TGraph = {
  startCell: TCell | undefined;
  finishCell: TCell | undefined;
  graph: TCell[][];
};

export type TGraphAction =
  | {
      type: EGraphActions.SetGraph;
      payload: TSetGraphPayload;
    }
  | {
      type: EGraphActions.UpdateCell;
      payload: TUpdateCellPayload;
    }
  | {
      type: EGraphActions.InitializeGraph;
      payload: TInitializeGraphPayload;
    };

export type TSetGraphPayload = {
  graph: TCell[][];
};

export type TUpdateCellPayload = {
  row: number;
  col: number;
  cellType: EGenericCellType;
};

export type TInitializeGraphPayload = {
  rows: number;
  columns: number;
};
