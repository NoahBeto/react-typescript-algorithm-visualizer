import { useReducer, useEffect, useState } from "react";
import { Cell, CellStyles, CellType } from "./ts/cell";
import {
  GraphAction,
  GraphActions,
  GraphAlgorithms,
  GraphHelper,
  Graph,
  UpdateGraphPayload,
  SetGraphPayload,
} from "./ts/GraphHelper";
import "./App.css";
import { CellNode } from "./components/CellNode";
import { AlertMessage } from "./components/AlertMessage";
import { DijkstraState, dijkstra, dijkstraBackTrack } from "./ts/Dijkstra";
import { generateMaze } from "./ts/RecursiveBacktracking";

import shuffleIcon from "./assets/icons/shuffleSolid.svg";
import OverlayDisable from "./components/OverlayDisable";

const ROWS = 21;

// ---------------------------------------------------------
// DO NOT CHANGE!!!
// TODO: Make columns dynamic. As of now, must be hard coded
//       because of CSS styling
const COLS = 41;
// ---------------------------------------------------------

// Reducer function to update a cell's style in the grid
// Parameters:
// - state: The current state of the grid (2D array of cells).
// - action: The action object containing information about the update.
// Return Value:
// - A new state representing the updated grid after applying the action.
const graphReducer = (state: Graph, action: GraphAction): Graph => {
  switch (action.type) {
    case GraphActions.SetGraph:
      return {
        ...state,
        graph: action.payload.graph,
      };

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
        startCell: undefined,
        finishCell: undefined,
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
  const [isMouseDown, setIsMouseDown] = useState<boolean>(false);
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
  const [overlayDisable, setOverlayDisable] = useState<boolean>(false);

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

  const setAllCellsToNormalExceptWallsStartFinish = () => {
    const updatedGraphWithoutWalls: Cell[][] = graph.graph.map((row) =>
      row.map((cell) =>
        cell.cellType === CellType.Wall ||
        cell.cellType === CellType.Start ||
        cell.cellType === CellType.Finish
          ? cell
          : { ...cell, cellType: CellType.Normal, cellStyle: CellStyles.Normal }
      )
    );

    let data: SetGraphPayload = {
      graph: updatedGraphWithoutWalls,
    };

    dispatch({
      type: GraphActions.SetGraph,
      payload: data,
    });

    // set the start cell and finish cell styles back
    updateCell(
      graph.startCell!.posRow!,
      graph.startCell!.posCol!,
      CellStyles.Start,
      CellType.Start
    );

    updateCell(
      graph.finishCell!.posRow!,
      graph.finishCell!.posCol!,
      CellStyles.Finish,
      CellType.Finish
    );
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

  const animateDijkstra = async () => {
    if (!dijkstraState.visited || !dijkstraState.path) return;

    setOverlayDisable(true);
    // animate dijkstra searching for finish cell
    for (const cell of dijkstraState.visited) {
      updateCell(
        cell.posRow,
        cell.posCol,
        CellStyles.SubtleHighlight,
        cell.cellType
      );
      await new Promise((resolve) => setTimeout(resolve, 5));
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
    setOverlayDisable(false);
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

    // if the user reruns the visualizer, we need to reset
    // all of the cells that are not walls, start, or finish
    setAllCellsToNormalExceptWallsStartFinish();
    switch (currentAlgorithm) {
      case GraphAlgorithms.Dijkstra:
        let res: {
          distances: { [key: string]: number };
          visited: Cell[];
        };
        try {
          res = dijkstra(graph);
        } catch (error) {
          setModalMessage("No path from start cell to finish cell");
          setIsModalOpen(true);
          return;
        }

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

  const handleRecursiveBacktrackBtn = async () => {
    setOverlayDisable(true);
    const res = generateMaze(ROWS, COLS);

    // set graph to all walls
    let _data: SetGraphPayload = {
      graph: GraphHelper.generateAllWallGraph(ROWS, COLS),
    };
    dispatch({
      type: GraphActions.SetGraph,
      payload: _data,
    });

    // animate recurrsive backtracking
    for (const cell of res.steps) {
      updateCell(cell.posRow, cell.posCol, CellStyles.Normal, cell.cellType);
      await new Promise((resolve) => setTimeout(resolve, 5));
      if (
        cell.posRow === graph.finishCell?.posRow &&
        cell.posCol === graph.finishCell?.posCol
      )
        break;
    }

    let data: SetGraphPayload = {
      graph: res.maze,
    };
    dispatch({
      type: GraphActions.SetGraph,
      payload: data,
    });
    setOverlayDisable(false);
  };

  // Handles when the user is placing walls and drags across cells
  const handleMouseEnterCell = (row: number, col: number): void => {
    if (!isMouseDown) return;
    handleCellClick(row, col);
  };

  const handleMouseDown = () => {
    setIsMouseDown(true);
  };

  const handleMouseUp = () => {
    setIsMouseDown(false);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="wrapper">
        <OverlayDisable show={overlayDisable} />
        <AlertMessage
          isOpen={isModalOpen}
          onClose={closeModal}
          message={modalMessage}
        ></AlertMessage>
        <div className="navbar">
          <button className="visualize-btn" onClick={() => handleGoButton()}>
            VISUALIZE
          </button>
          <button
            className="reset-graph"
            onClick={() => handleResetGraphButton()}
          >
            Reset Graph
          </button>
          <hr className="rounded separator" />
          <h3 className="title-medium">Path Finders</h3>
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

          <div className="start-end-selector-container">
            <div
              className={`selector  ${
                selectedCellTypeToPlace === CellType.Start
                  ? "selector-highlight"
                  : "selector-normal"
              }`}
              onClick={() =>
                handleCellTypeToPlace(CellStyles.Start, CellType.Start)
              }
            >
              <div className="cell-start selector-icon"></div>
              <div>Set Start Cell</div>
            </div>
            <div
              className={`selector  ${
                selectedCellTypeToPlace === CellType.Finish
                  ? "selector-highlight"
                  : "selector-normal"
              }`}
              onClick={() =>
                handleCellTypeToPlace(CellStyles.Finish, CellType.Finish)
              }
            >
              <div className="cell-finish selector-icon"></div>
              <div>Set Finish Cell</div>
            </div>
            <div
              className={`selector  ${
                selectedCellTypeToPlace === CellType.Wall
                  ? "selector-highlight"
                  : "selector-normal"
              }`}
              onClick={() =>
                handleCellTypeToPlace(CellStyles.Wall, CellType.Wall)
              }
            >
              <div className="cell-wall selector-icon "></div>
              <div>Set Wall Cell</div>
            </div>
            <div
              className={`selector  ${
                selectedCellTypeToPlace === CellType.Normal
                  ? "selector-highlight"
                  : "selector-normal"
              }`}
              onClick={() =>
                handleCellTypeToPlace(CellStyles.Normal, CellType.Normal)
              }
            >
              <div className="cell-normal selector-icon "></div>
              <div>Set Normal Cell</div>
            </div>
          </div>
          <hr className="rounded separator" />
          <h3 className="title-medium">Maze Generation</h3>
          <div className="maze-generation-selectors-container">
            <div
              className="selector selector-normal"
              onClick={() => handleRecursiveBacktrackBtn()}
            >
              <img
                src={shuffleIcon}
                alt="shuffle icon"
                className="selector-icon"
              />
              <div>Recur. Backtrack</div>
            </div>
          </div>
        </div>

        <div
          className="graphWrapper"
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
        >
          {graph.graph.map((row) =>
            row.map((item) => (
              <CellNode
                key={`${item.posRow}-${item.posCol}`}
                cellStyles={item.cellStyle}
                row={item.posRow}
                col={item.posCol}
                onMouseDown={handleCellClick}
                _onMouseEnter={handleMouseEnterCell}
              ></CellNode>
            ))
          )}
        </div>
      </div>
    </>
  );
}

export default App;
