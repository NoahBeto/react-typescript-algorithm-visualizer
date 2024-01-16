import { Cell } from "../cell";
import { GraphActions } from "../enums/GraphHelper.enums";
import {
  SetGraphPayload,
  UpdateGraphPayload,
  InitializeGraphPayload,
} from "../interfaces/GraphHelper.interfaces";

export type Graph = {
  startCell: Cell | undefined;
  finishCell: Cell | undefined;
  graph: Cell[][];
};
export type GraphAction =
  | {
      type: GraphActions.SetGraph;
      payload: SetGraphPayload;
    }
  | {
      type: GraphActions.UpdateCell;
      payload: UpdateGraphPayload;
    }
  | {
      type: GraphActions.InitializeGraph;
      payload: InitializeGraphPayload;
    };
