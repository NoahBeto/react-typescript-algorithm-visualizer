import { useReducer } from "react";
import {
  GraphHelper,
  GraphType,
  CellStyles,
  CellActions,
  Cell,
} from "./ts/cell";
import "./App.css";
import { CellNode } from "./components/CellNode";

const ROWS = 5;

// ---------------------------------------------------------
// DO NOT CHANGE!!!
// TODO: Make columns dynamic. As of now, must be hard coded
//       because of CSS styling
const COLS = 40;
// ---------------------------------------------------------

const graph: GraphType = [];
graph.push(...GraphHelper.generateGraph(ROWS, COLS));
let start = GraphHelper.getCell(graph, 0, 0);
let end = GraphHelper.getCell(graph, 4, 0);
let distances: { [key: string]: number } = GraphHelper.dijkstra(graph, start);
let path: Cell[] = GraphHelper.getPath(graph, distances, start, end);

// Defines the action used on the reducer for updating the state of a cell in the grid
interface UpdateCellAction {
  type: CellActions.UpdateCell;
  payload: {
    row: number;
    col: number;
    style: CellStyles;
  };
}

// Reducer function to update a cell's style in the grid
// Parameters:
// - state: The current state of the grid (2D array of cells).
// - action: The action object containing information about the update.
// Return Value:
// - A new state representing the updated grid after applying the action.
const cellReducer = (state: GraphType, action: UpdateCellAction): GraphType => {
  switch (action.type) {
    case CellActions.UpdateCell:
      const newState: GraphType = [...state];
      newState[action.payload.row] = [...state[action.payload.row]];
      newState[action.payload.row][action.payload.col].cellStyle =
        action.payload.style;
      return newState;
  }
};
function App() {
  const [grid, dispatch] = useReducer(cellReducer, graph);

  // Function to update a cell in the grid
  // Parameters:
  // - row: The row index of the cell to be updated.
  // - col: The column index of the cell to be updated.
  // - style: The new style to be assigned to the cell.
  // Return Value: None (dispatches an action to update the grid state)
  const updateCell = (row: number, col: number, style: CellStyles): void => {
    dispatch({
      type: CellActions.UpdateCell,
      payload: { row, col, style },
    });
  };

  return (
    <>
      <div className="wrapper">
        <div className="navbar">
          <div className="dropdown">
            <button className="dropbtn">(Select Algorithm)</button>
            <div className="dropdown-content">
              <div className="dropdown-item">Dijkstra</div>
              <div className="dropdown-item">A*</div>
              <div className="dropdown-item">Algorithm 3</div>
              <div className="dropdown-item">Algorithm 4</div>
              <div className="dropdown-item">Algorithm 5</div>
            </div>
          </div>
          <button className="visualize-btn">Button</button>
        </div>
        <div className="graphWrapper">
          {graph.map((row, index) =>
            row.map((item, _index) => (
              <CellNode
                key={`${item.posRow}-${item.posCol}`}
                cellStyles={item.cellStyle}
              ></CellNode>
            ))
          )}
        </div>
      </div>
    </>
  );
}

export default App;
