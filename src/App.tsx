import { useReducer, useEffect, useState, useRef } from "react";
import { CellStyles, Cell } from "./ts/cell";
import {
  GraphAction,
  GraphActions,
  GraphAlgorithms,
  GraphHelper,
  GraphType,
  UpdateGraphPayload,
} from "./ts/GraphHelper";
import "./App.css";
import { CellNode } from "./components/CellNode";
import { AlertMessage } from "./components/AlertMessage";

const ROWS = 20;

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
const graphReducer = (state: GraphType, action: GraphAction): GraphType => {
  switch (action.type) {
    case GraphActions.UpdateCell:
      const newGraph: GraphType = [...state];
      newGraph[action.payload.row][action.payload.col].cellStyle =
        action.payload.style;
      return newGraph;
    case GraphActions.InitializeGraph:
      return GraphHelper.generateGraph(
        action.payload.rows,
        action.payload.columns
      );
  }
};

interface DijkstraState {
  selectedCellStyleToPlace: CellStyles;
  startCell: Cell | undefined;
  finishCell: Cell | undefined;
  distances: { [key: string]: number } | undefined;
  path: Cell[] | undefined;
  visited: Cell[] | undefined;
}

let dijkstraState: DijkstraState = {
  selectedCellStyleToPlace: CellStyles.Start,
  startCell: undefined,
  finishCell: undefined,
  distances: undefined,
  path: undefined,
  visited: undefined,
};

function App() {
  const [graph, dispatch] = useReducer(graphReducer, []);
  const [selectedCellStyleToPlace, setSelectedCellToPlace] =
    useState<CellStyles>(CellStyles.Normal);

  const [currentAlgorithm, setCurrentAlgorithm] =
    useState<GraphAlgorithms | null>(null);

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalMessage, setModalMessage] = useState<string>(
    "Error, invalid input"
  );

  // Function to initialize the graph
  // Return Value: None (dispatches an action to update the grid state)
  const initializeGraph = (): void => {
    let rows = ROWS;
    let columns = COLS;
    dispatch({
      type: GraphActions.InitializeGraph,
      payload: { rows, columns },
    });
  };

  // initialize graph on initial load
  useEffect(() => {
    initializeGraph();
  }, []);

  // Handles resetting the graph to initial state
  const handleResetGraphButton = (): void => {
    initializeGraph();
    dijkstraState = {
      selectedCellStyleToPlace: CellStyles.Start,
      startCell: undefined,
      finishCell: undefined,
      distances: undefined,
      path: undefined,
      visited: undefined,
    };
  };

  // Handle clicking the desired path finding algorithm
  const handleChooseAlgorithm = (clicked: GraphAlgorithms): void => {
    setCurrentAlgorithm(clicked);
  };

  // Handle clicking on the desired cell to place in the graph
  // Parameters:
  // - cellClicked: The CellStyle to be set to the current cell being placed
  // e.g. CellStyles.Start, CellStyles.Finish.
  const handleSetCellToPlace = (cellClicked: CellStyles): void => {
    setSelectedCellToPlace(cellClicked);
  };

  // Handles updating the clicked cell based on the current desired
  // cell to place e.g. Start, Finish, etc.
  const handleCellClick = (
    row: number,
    col: number,
    style?: CellStyles
  ): void => {
    // set the clicked cell to the desired type (start or finish)
    style = selectedCellStyleToPlace;
    dispatch({
      type: GraphActions.UpdateCell,
      payload: { row, col, style },
    });

    // if the user is currently placing a start cell, then set the
    // previous start cell to normal, and update the clicked cell
    // to a start cell
    if (style === CellStyles.Start) {
      // update previous start cell
      if (dijkstraState.startCell !== undefined) {
        console.log(`current: ${dijkstraState.startCell}`);
        let data: UpdateGraphPayload = {
          row: dijkstraState.startCell.posRow,
          col: dijkstraState.startCell.posCol,
          style: CellStyles.Normal,
        };
        dispatch({
          type: GraphActions.UpdateCell,
          payload: data,
        });
      }
      // set new start cell
      dijkstraState.startCell = GraphHelper.getCell(graph, row, col);
    }
    // if the user is currently placing a finsh cell, then set the
    // previous finish cell to normal, and update the clicked cell
    // to a finish cell
    else if (style === CellStyles.Finish) {
      // update previous finish cell
      if (dijkstraState.finishCell !== undefined) {
        let data: UpdateGraphPayload = {
          row: dijkstraState.finishCell.posRow,
          col: dijkstraState.finishCell.posCol,
          style: CellStyles.Normal,
        };
        dispatch({
          type: GraphActions.UpdateCell,
          payload: data,
        });
      }
      // set finish start cell
      dijkstraState.finishCell = GraphHelper.getCell(graph, row, col);
    }
  };

  // Function to update a cell in the grid
  // Parameters:
  // - row: The row index of the cell to be updated.
  // - col: The column index of the cell to be updated.
  // - style: The new style to be assigned to the cell.
  // Return Value: None (dispatches an action to update the grid state)
  const updateCell = (row: number, col: number, style: CellStyles): void => {
    dispatch({
      type: GraphActions.UpdateCell,
      payload: { row, col, style },
    });
  };

  const handleGoButton = (): void => {
    switch (currentAlgorithm) {
      case GraphAlgorithms.Dijkstra:
        if (!dijkstraState.startCell || !dijkstraState.finishCell) {
          setModalMessage("Please place a start and finish cell");
          setIsModalOpen(true);
          return;
        }

        const res: [{ [key: string]: number }, Cell[]] = GraphHelper.dijkstra(
          graph,
          dijkstraState.startCell
        );
        dijkstraState.distances = res[0];
        dijkstraState.visited = res[1];
        dijkstraState.path = GraphHelper.dijkstraBackTrack(
          graph,
          dijkstraState.distances,
          dijkstraState.startCell,
          dijkstraState.finishCell
        );
        animate();
        break;
      default:
        setModalMessage("Please select an algorithm");
        setIsModalOpen(true);
    }
  };

  const animate = async () => {
    if (!dijkstraState.visited || !dijkstraState.path) return;

    // animate dijkstra searching for finish cell
    for (const cell of dijkstraState.visited) {
      updateCell(cell.posRow, cell.posCol, CellStyles.SubtleHighlight);
      await new Promise((resolve) => setTimeout(resolve, 5));
      if (cell === dijkstraState.finishCell) break;
    }

    // animate shortest path from start to finish cell
    for (const cell of dijkstraState.path) {
      updateCell(cell.posRow, cell.posCol, CellStyles.Highlight);
      await new Promise((resolve) => setTimeout(resolve, 50));
      if (cell === dijkstraState.finishCell) break;
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="wrapper">
        <AlertMessage
          isOpen={isModalOpen}
          onClose={closeModal}
          message={modalMessage}
        ></AlertMessage>
        <div className="navbar">
          <button
            className="reset-graph"
            onClick={() => handleResetGraphButton()}
          >
            Reset Graph
          </button>
          <div className="dropdown">
            <button className="dropbtn">
              {currentAlgorithm ? currentAlgorithm : "(Select Algorithm)"}
            </button>
            <div className="dropdown-content">
              <div
                className="dropdown-item"
                onClick={() => handleChooseAlgorithm(GraphAlgorithms.Dijkstra)}
              >
                Dijkstra
              </div>
              <div
                className="dropdown-item"
                onClick={() => handleChooseAlgorithm(GraphAlgorithms.Astar)}
              >
                A*
              </div>
            </div>
          </div>
          <button className="visualize-btn" onClick={() => handleGoButton()}>
            Go
          </button>
          <div className="start-end-selector-container">
            <div
              className="selector selector-normal"
              onClick={() => handleSetCellToPlace(CellStyles.Start)}
            >
              <div className="cell cell-start"></div>
              <div>Set Start Cell</div>
            </div>
            <div
              className="selector selector-normal"
              onClick={() => handleSetCellToPlace(CellStyles.Finish)}
            >
              <div className="cell cell-finish"></div>
              <div>Set Finish Cell</div>
            </div>
          </div>
        </div>
        <div className="graphWrapper">
          {graph.map((row, index) =>
            row.map((item, _index) => (
              <CellNode
                key={`${item.posRow}-${item.posCol}`}
                cellStyles={item.cellStyle}
                row={item.posRow}
                col={item.posCol}
                onClick={handleCellClick}
              ></CellNode>
            ))
          )}
        </div>
      </div>
    </>
  );
}

export default App;
