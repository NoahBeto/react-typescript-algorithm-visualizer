import { useReducer, useEffect, useState } from "react";
import { CellStyles, CellType } from "./ts/cell";
import {
  GraphAction,
  GraphActions,
  GraphAlgorithms,
  GraphHelper,
  Graph,
  UpdateGraphPayload,
} from "./ts/GraphHelper";
import "./App.css";
import { CellNode } from "./components/CellNode";
import { AlertMessage } from "./components/AlertMessage";
import { DijkstraState, dijkstra, dijkstraBackTrack } from "./ts/Dijkstra";

const ROWS = 10;

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
const graphReducer = (state: Graph, action: GraphAction): Graph => {
  switch (action.type) {
    case GraphActions.UpdateCell:
      const updatedGraph = state.graph.map((row, rowIndex) =>
        rowIndex === action.payload.row
          ? row.map((cell, colIndex) =>
              colIndex === action.payload.col
                ? {
                    ...cell,
                    cellStyle: action.payload.style,
                    cellType: action.payload.cellType,
                  }
                : cell
            )
          : row
      );

      return {
        ...state,
        graph: updatedGraph,
      };

    case GraphActions.InitializeGraph:
      return {
        ...state,
        graph: GraphHelper.generateGraph(
          action.payload.rows,
          action.payload.columns
        ),
      };

    // Handle other action types if needed

    default:
      return state;
  }
};

let dijkstraState: DijkstraState = {
  selectedCellStyleToPlace: CellStyles.Start,
  distances: undefined,
  path: undefined,
  visited: undefined,
};

const initialGraph: Graph = {
  startCell: undefined,
  finishCell: undefined,
  graph: [],
};

function App() {
  const [graph, dispatch] = useReducer(graphReducer, initialGraph);
  const [selectedCellStyleToPlace, setSelectedCellStyleToPlace] =
    useState<CellStyles>(CellStyles.Normal);
  const [selectedCellTypeToPlace, setSelectedCellTypeToPlace] =
    useState<CellType>(CellType.Normal);

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
  const handleCellTypeToPlace = (
    style: CellStyles,
    cellType: CellType
  ): void => {
    setSelectedCellStyleToPlace(style);
    setSelectedCellTypeToPlace(cellType);
  };

  // Handles updating the clicked cell based on the current desired
  // cell to place e.g. Start, Finish, etc.
  const handleCellClick = (
    row: number,
    col: number,
    style?: CellStyles,
    cellType?: CellType
  ): void => {
    if (
      GraphHelper.getCell(graph, row, col).cellType === CellType.Start ||
      GraphHelper.getCell(graph, row, col).cellType === CellType.Finish
    ) {
      return;
    }
    // set the clicked cell to the desired type
    style = selectedCellStyleToPlace;
    cellType = selectedCellTypeToPlace;
    dispatch({
      type: GraphActions.UpdateCell,
      payload: { row, col, style, cellType },
    });

    // if the user is currently placing a start cell, then set the
    // previous start cell to normal, and update the clicked cell
    // to a start cell
    if (cellType === CellType.Start) {
      // update previous start cell
      if (graph.startCell !== undefined) {
        let data: UpdateGraphPayload = {
          row: graph.startCell.posRow,
          col: graph.startCell.posCol,
          style: CellStyles.Normal,
          cellType: CellType.Normal,
        };
        dispatch({
          type: GraphActions.UpdateCell,
          payload: data,
        });
      }
      // set new start cell
      graph.startCell = GraphHelper.getCell(graph, row, col);
    }
    // if the user is currently placing a finsh cell, then set the
    // previous finish cell to normal, and update the clicked cell
    // to a finish cell
    else if (cellType === CellType.Finish) {
      // update previous finish cell
      if (graph.finishCell !== undefined) {
        let data: UpdateGraphPayload = {
          row: graph.finishCell.posRow,
          col: graph.finishCell.posCol,
          style: CellStyles.Normal,
          cellType: CellType.Normal,
        };
        dispatch({
          type: GraphActions.UpdateCell,
          payload: data,
        });
      }
      // set finish start cell
      graph.finishCell = GraphHelper.getCell(graph, row, col);
    }
  };

  // Function to update a cell in the grid
  // Parameters:
  // - row: The row index of the cell to be updated.
  // - col: The column index of the cell to be updated.
  // - style: The new style to be assigned to the cell.
  // Return Value: None (dispatches an action to update the grid state)
  const updateCell = (
    row: number,
    col: number,
    style: CellStyles,
    cellType: CellType
  ): void => {
    dispatch({
      type: GraphActions.UpdateCell,
      payload: { row, col, style, cellType },
    });
  };

  // Function to handle user pressing the go button. If a start and
  // finish cell have been chosen, then the function checks to see
  // which algorithm is chosen, and attempts to run the algorithm,
  // and animate the graph.
  const handleGoButton = (): void => {
    if (!graph.startCell || !graph.finishCell) {
      setModalMessage("Please place a start and finish cell");
      setIsModalOpen(true);
      return;
    }

    switch (currentAlgorithm) {
      case GraphAlgorithms.Dijkstra:
        const res = dijkstra(graph);
        dijkstraState.distances = res.distances;
        dijkstraState.visited = res.visited;
        dijkstraState.path = dijkstraBackTrack(graph, dijkstraState);
        animateDijkstra();
        break;

      default:
        setModalMessage("Please select an algorithm");
        setIsModalOpen(true);
    }
  };

  const animateDijkstra = async () => {
    if (!dijkstraState.visited || !dijkstraState.path) return;

    // animate dijkstra searching for finish cell
    for (const cell of dijkstraState.visited) {
      updateCell(
        cell.posRow,
        cell.posCol,
        CellStyles.SubtleHighlight,
        cell.cellType
      );
      await new Promise((resolve) => setTimeout(resolve, 25));
      if (
        cell.posRow === graph.finishCell?.posRow &&
        cell.posCol === graph.finishCell?.posCol
      )
        break;
    }

    // animate shortest path from start to finish cell
    for (const cell of dijkstraState.path) {
      updateCell(cell.posRow, cell.posCol, CellStyles.Highlight, cell.cellType);
      await new Promise((resolve) => setTimeout(resolve, 50));
      if (
        cell.posRow === graph.finishCell?.posRow &&
        cell.posCol === graph.finishCell?.posCol
      )
        break;
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
              {/* <div
                className="dropdown-item"
                onClick={() => handleChooseAlgorithm(GraphAlgorithms.Astar)}
              >
                A*
              </div> */}
            </div>
          </div>
          <button className="visualize-btn" onClick={() => handleGoButton()}>
            Go
          </button>
          <div className="start-end-selector-container">
            <div
              className="selector selector-normal"
              onClick={() =>
                handleCellTypeToPlace(CellStyles.Start, CellType.Start)
              }
            >
              <div className="cell cell-start"></div>
              <div>Set Start Cell</div>
            </div>
            <div
              className="selector selector-normal"
              onClick={() =>
                handleCellTypeToPlace(CellStyles.Finish, CellType.Finish)
              }
            >
              <div className="cell cell-finish"></div>
              <div>Set Finish Cell</div>
            </div>
            <div
              className="selector selector-normal"
              onClick={() =>
                handleCellTypeToPlace(CellStyles.Wall, CellType.Wall)
              }
            >
              <div className="cell cell-wall"></div>
              <div>Set Wall Cell</div>
            </div>
          </div>
        </div>
        <div className="graphWrapper">
          {graph.graph.map((row, index) =>
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
