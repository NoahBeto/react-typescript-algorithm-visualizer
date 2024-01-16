import { Cell } from "../cell";
import { EGraphActions } from "../enums/GraphHelper.enums";
import { ECellType } from "../enums/cell.enums";

export type TGraph = {
  startCell: Cell | undefined;
  finishCell: Cell | undefined;
  graph: Cell[][];
};

export type TGraphAction =
  | {
      type: EGraphActions.SetGraph;
      payload: TSetGraphPayload;
    }
  | {
      type: EGraphActions.UpdateCell;
      payload: TUpdateGraphPayload;
    }
  | {
      type: EGraphActions.InitializeGraph;
      payload: TInitializeGraphPayload;
    };

export type TSetGraphPayload = {
  graph: Cell[][];
};

export type TUpdateGraphPayload = {
  row: number;
  col: number;
  cellType: ECellType;
};

export type TInitializeGraphPayload = {
  rows: number;
  columns: number;
};
