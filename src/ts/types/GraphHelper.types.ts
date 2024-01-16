import { Cell } from "../cell";
import { EGraphActions } from "../enums/GraphHelper.enums";
import {
  ISetGraphPayload,
  IUpdateGraphPayload,
  IInitializeGraphPayload,
} from "../interfaces/GraphHelper.interfaces";

export type TGraph = {
  startCell: Cell | undefined;
  finishCell: Cell | undefined;
  graph: Cell[][];
};
export type TGraphAction =
  | {
      type: EGraphActions.SetGraph;
      payload: ISetGraphPayload;
    }
  | {
      type: EGraphActions.UpdateCell;
      payload: IUpdateGraphPayload;
    }
  | {
      type: EGraphActions.InitializeGraph;
      payload: IInitializeGraphPayload;
    };
