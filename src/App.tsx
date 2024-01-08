import { useReducer, useEffect, useState } from "react";
import {
  GraphHelper,
  GraphType,
  CellStyles,
  CellActions,
  Cell,
  CellAction,
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

// Reducer function to update a cell's style in the grid
// Parameters:
// - state: The current state of the grid (2D array of cells).
// - action: The action object containing information about the update.
// Return Value:
// - A new state representing the updated grid after applying the action.
const cellReducer = (state: GraphType, action: CellAction): GraphType => {
  switch (action.type) {
    case CellActions.UpdateCell:
      const newState: GraphType = [...state];
      newState[action.payload.row] = [...state[action.payload.row]];
      newState[action.payload.row][action.payload.col].cellStyle =
        action.payload.style;
      return newState;
    case CellActions.InitializeGraph:
      return GraphHelper.generateGraph(
        action.payload.rows,
        action.payload.columns
      );
  }
};

function App() {
  const [graph, dispatch] = useReducer(cellReducer, []);
  const [hasGraphUpdated, setHasGraphUpdated] = useState<Boolean>(false);
  let start: Cell;
  let end: Cell;
  let distances: { [key: string]: number };
  let path: Cell[];

  // initialize graph on initial load
  useEffect(() => {
    initializeGraph(ROWS, COLS);
  }, []);

  //
  useEffect(() => {
    if (graph.length === 0) return;

    start = GraphHelper.getCell(graph, 0, 0);
    end = GraphHelper.getCell(graph, 3, 29);
    distances = GraphHelper.dijkstra(graph, start);
    path = GraphHelper.getPath(graph, distances, start, end);

    setHasGraphUpdated(true);
  }, [graph, hasGraphUpdated]);

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

  // Function to initialize the graph
  // Parameters:
  // - row: The row index of the cell to be updated.
  // - col: The column index of the cell to be updated.
  // - style: The new style to be assigned to the cell.
  // Return Value: None (dispatches an action to update the grid state)
  const initializeGraph = (rows: number, columns: number): void => {
    dispatch({
      type: CellActions.InitializeGraph,
      payload: { rows, columns },
    });
  };

  // Iterates through the path from the start cell to the end cell
  // and animates the path along the way
  const startAnimation = async () => {
    for (const cell of path) {
      updateCell(cell.posRow, cell.posCol, CellStyles.Highlight);
      await new Promise((resolve) => setTimeout(resolve, 50));
    }
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
          <button className="visualize-btn" onClick={() => startAnimation()}>
            Button
          </button>
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
