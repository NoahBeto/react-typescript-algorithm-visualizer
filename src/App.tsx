import { useState, useEffect, useReducer } from "react";
import { CellGrid, Cell, CellType, CellStyles, CellActions } from "./ts/cell";
import "./App.css";
import { CellNode } from "./components/CellNode";

const ROWS = 5;
const COLS = 40;
const _grid: CellGrid = [];

// Initializes cell grid using ROWS and COLS constants with Cell objects
const initialize = () => {
  let res: CellGrid = [];

  for (let i = 0; i < ROWS; i++) {
    let row: Cell[] = [];
    for (let j = 0; j < COLS; j++) {
      row.push({
        posRow: i,
        posCol: j,
        cellType: CellType.Normal,
        cellStyle: CellStyles.Normal,
      });
    }
    res.push(row);
  }
  console.log(res);
  _grid.push(...res);
};

initialize();

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
const cellReducer = (state: CellGrid, action: UpdateCellAction): CellGrid => {
  switch (action.type) {
    case CellActions.UpdateCell:
      const newState: CellGrid = [...state];
      newState[action.payload.row] = [...state[action.payload.row]];
      newState[action.payload.row][action.payload.col].cellStyle =
        action.payload.style;
      return newState;
  }
};
function App() {
  const [grid, dispatch] = useReducer(cellReducer, _grid);

  // Function to update a cell in the cell grid
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

  useEffect(() => {
    updateCell(0, 0, CellStyles.Start);
  }, []);

  return (
    <>
      <div className="gridWrapper">
        {grid.map((row, index) =>
          row.map((item, _index) => (
            <CellNode
              key={`${item.posRow}-${item.posCol}`}
              cellStyles={item.cellStyle}
            ></CellNode>
          ))
        )}
      </div>
    </>
  );
}

export default App;
