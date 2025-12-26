import { useReducer, useEffect, useState } from "react";
import { GraphHelper } from "./ts/GraphHelper";
import { TGraphAction, TGraph, TUpdateCellPayload, TSetGraphPayload } from "./ts/types/GraphHelper.types";
import { EGraphActions, EGraphAlgorithms } from "./ts/enums/GraphHelper.enums";
import "./App.css";
import { CellNode } from "./components/CellNode";
import { AlertMessage } from "./components/AlertMessage";
import { generateMaze } from "./ts/RecursiveBacktracking";

import shuffleIcon from "./assets/icons/shuffleSolid.svg";
import OverlayDisable from "./components/OverlayDisable";
import { ETraceAnimationSpeed } from "./ts/enums/animation.enums";
import { GenericGraph } from "./ts/GenericGraph";
import { EGenericCellType } from "./ts/types/GenericCell.types";
import { TCell } from "./ts/types/Cell.types";

// ---------------------------------------------------------
// DO NOT CHANGE!!!
// TODO: Make columns and rows dynamic. As of now, must be
//  hard coded because of CSS styling
const ROWS = 21;
const COLS = 41;
// ---------------------------------------------------------

const graphReducer = (state: TGraph, action: TGraphAction): TGraph => {
  switch (action.type) {
    case EGraphActions.SetGraph:
      return {
        ...state,
        graph: action.payload.graph,
      };

    case EGraphActions.UpdateCell: {
      const updatedGraph = state.graph.map((row, rowIndex) =>
        rowIndex === action.payload.row
          ? row.map((cell, colIndex) =>
              colIndex === action.payload.col
                ? {
                    ...cell,
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
    }

    case EGraphActions.InitializeGraph:
      return {
        ...state,
        graph: GraphHelper.generateGraph(action.payload.rows, action.payload.columns),
        startCell: undefined,
        finishCell: undefined,
      };

    default:
      return state;
  }
};

const initialGraph: TGraph = {
  startCell: undefined,
  finishCell: undefined,
  graph: [],
};

function App() {
  const [graph, dispatch] = useReducer(graphReducer, initialGraph);

  const [traceSearchSpeed, setTraceSearchSpeed] =
    useState<ETraceAnimationSpeed>(ETraceAnimationSpeed.SPEED_TWO);
  const [tracePathSpeed, setTracePathSpeed] =
    useState<ETraceAnimationSpeed>(ETraceAnimationSpeed.SPEED_TWO);
  const [traceMazeGenerationSpeed, setTraceMazeGenerationSpeed] =
    useState<ETraceAnimationSpeed>(ETraceAnimationSpeed.SPEED_THREE);

  const [isMouseDown, setIsMouseDown] = useState<boolean>(false);

  const [selectedCellTypeToPlace, setSelectedCellTypeToPlace] =
    useState<EGenericCellType>(EGenericCellType.NORMAL);

  const [currentAlgorithm, setCurrentAlgorithm] =
    useState<EGraphAlgorithms | null>(null);

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalMessage, setModalMessage] = useState<string>("Error, invalid input");
  const [overlayDisable, setOverlayDisable] = useState<boolean>(false);

  const initializeGraph = (): void => {
    const rows = ROWS;
    const columns = COLS;
    dispatch({
      type: EGraphActions.InitializeGraph,
      payload: { rows, columns },
    });
  };

  const setAllCellsToNormalExceptWallsStartFinish = () => {
    const updatedGraphWithoutWalls: TCell[][] = graph.graph.map((row) =>
      row.map((cell) =>
        cell.cellType === EGenericCellType.WALL ||
        cell.cellType === EGenericCellType.START ||
        cell.cellType === EGenericCellType.FINISH
          ? cell
          : { ...cell, cellType: EGenericCellType.NORMAL }
      )
    );

    const data: TSetGraphPayload = { graph: updatedGraphWithoutWalls };

    dispatch({
      type: EGraphActions.SetGraph,
      payload: data,
    });

    // set the start cell and finish cell styles back
    updateCell(graph.startCell!.posRow!, graph.startCell!.posCol!, EGenericCellType.START);
    updateCell(graph.finishCell!.posRow!, graph.finishCell!.posCol!, EGenericCellType.FINISH);
  };

  useEffect(() => {
    initializeGraph();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleResetGraphButton = (): void => {
    initializeGraph();
  };

  const handleSelectAlgorithmBtn = (clicked: EGraphAlgorithms): void => {
    setCurrentAlgorithm(clicked);
  };

  const handleTraceSearchSpeedBtns = (speed: ETraceAnimationSpeed) => {
    setTraceSearchSpeed(speed);
  };

  const handleTracePathSpeedBtns = (speed: ETraceAnimationSpeed) => {
    setTracePathSpeed(speed);
  };

  const handleTraceMazeGenerationSpeedBtns = (speed: ETraceAnimationSpeed) => {
    setTraceMazeGenerationSpeed(speed);
  };

  const handleCellTypeToPlace = (cellType: EGenericCellType): void => {
    setSelectedCellTypeToPlace(cellType);
  };

  const updateCell = (row: number, col: number, cellType: EGenericCellType): void => {
    dispatch({
      type: EGraphActions.UpdateCell,
      payload: { row, col, cellType },
    });
  };

  const handleCellClick = (row: number, col: number, cellType?: EGenericCellType): void => {
    if (
      GraphHelper.getCell(graph, row, col).cellType === EGenericCellType.START ||
      GraphHelper.getCell(graph, row, col).cellType === EGenericCellType.FINISH
    ) {
      return;
    }

    cellType = selectedCellTypeToPlace;
    dispatch({
      type: EGraphActions.UpdateCell,
      payload: { row, col, cellType },
    });

    if (cellType === EGenericCellType.START) {
      if (graph.startCell !== undefined) {
        const data: TUpdateCellPayload = {
          row: graph.startCell.posRow,
          col: graph.startCell.posCol,
          cellType: EGenericCellType.NORMAL,
        };
        dispatch({ type: EGraphActions.UpdateCell, payload: data });
      }
      graph.startCell = GraphHelper.getCell(graph, row, col);
    } else if (cellType === EGenericCellType.FINISH) {
      if (graph.finishCell !== undefined) {
        const data: TUpdateCellPayload = {
          row: graph.finishCell.posRow,
          col: graph.finishCell.posCol,
          cellType: EGenericCellType.NORMAL,
        };
        dispatch({ type: EGraphActions.UpdateCell, payload: data });
      }
      graph.finishCell = GraphHelper.getCell(graph, row, col);
    }
  };

  const handleVisualizeBtn = (): void => {
    if (!graph.startCell || !graph.finishCell) {
      setModalMessage("Please place a start and finish cell");
      setIsModalOpen(true);
      return;
    }

    setAllCellsToNormalExceptWallsStartFinish();

    const genericGraphInstance = new GenericGraph({
      importedGraph: graph,
      rows: ROWS,
      cols: COLS,
    });

    switch (currentAlgorithm) {
      case EGraphAlgorithms.Dijkstra: {
        let res;
        try {
          res = genericGraphInstance.dijkstra();
        } catch (error) {
          setModalMessage("No path found");
          setIsModalOpen(true);
          break;
        }
        animateDijkstra(res.visited, res.shortestPath);
        break;
      }

      case EGraphAlgorithms.Astar: {
        const astarRes: { shortestPath: TCell[]; visited: TCell[] } = genericGraphInstance.astar();
        if (astarRes.shortestPath.length === 0) {
          setModalMessage("No path found");
          setIsModalOpen(true);
          break;
        }
        animateAstar(astarRes.shortestPath, astarRes.visited);
        break;
      }

      default:
        setModalMessage("Please select an algorithm");
        setIsModalOpen(true);
    }
  };

  const animateDijkstra = async (visited: TCell[], shortestPath: TCell[]) => {
    setOverlayDisable(true);

    for (const cell of visited) {
      updateCell(cell.posRow, cell.posCol, EGenericCellType.SUBTLEHIGHLIGHT);
      await new Promise((resolve) => setTimeout(resolve, traceSearchSpeed));
      if (cell.posRow === graph.finishCell?.posRow && cell.posCol === graph.finishCell?.posCol) break;
    }

    for (const cell of shortestPath) {
      updateCell(cell.posRow, cell.posCol, EGenericCellType.HIGHLIGHT);
      await new Promise((resolve) => setTimeout(resolve, tracePathSpeed));
      if (cell.posRow === graph.finishCell?.posRow && cell.posCol === graph.finishCell?.posCol) break;
    }

    setOverlayDisable(false);
  };

  const animateAstar = async (shortestPath: TCell[], visited: TCell[]) => {
    setOverlayDisable(true);

    for (const cell of visited) {
      updateCell(cell.posRow, cell.posCol, EGenericCellType.SUBTLEHIGHLIGHT);
      await new Promise((resolve) => setTimeout(resolve, traceSearchSpeed));
      if (cell.posRow === graph.finishCell?.posRow && cell.posCol === graph.finishCell?.posCol) break;
    }

    for (const cell of shortestPath) {
      updateCell(cell.posRow, cell.posCol, EGenericCellType.HIGHLIGHT);
      await new Promise((resolve) => setTimeout(resolve, tracePathSpeed));
      if (cell.posRow === graph.finishCell?.posRow && cell.posCol === graph.finishCell?.posCol) break;
    }

    setOverlayDisable(false);
  };

  const handleRecursiveBacktrackBtn = async () => {
    setOverlayDisable(true);
    const res = generateMaze(ROWS, COLS);

    graph.startCell = undefined;
    graph.finishCell = undefined;

    const _data: TSetGraphPayload = {
      graph: GraphHelper.generateAllWallGraph(ROWS, COLS),
    };
    dispatch({ type: EGraphActions.SetGraph, payload: _data });

    for (const cell of res.steps) {
      updateCell(cell.posRow, cell.posCol, EGenericCellType.NORMAL);
      await new Promise((resolve) => setTimeout(resolve, traceMazeGenerationSpeed));
    }

    const data: TSetGraphPayload = { graph: res.maze };
    dispatch({ type: EGraphActions.SetGraph, payload: data });
    setOverlayDisable(false);
  };

  const handleMouseEnterCell = (row: number, col: number): void => {
    if (!isMouseDown) return;
    handleCellClick(row, col);
  };

  const handleMouseDown = () => setIsMouseDown(true);
  const handleMouseUp = () => setIsMouseDown(false);

  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="wrapper">
      <OverlayDisable show={overlayDisable} />

      <AlertMessage isOpen={isModalOpen} onClose={closeModal} message={modalMessage} />

      <div className="navbar">
        <button className="visualize-btn" onClick={() => handleVisualizeBtn()}>
          VISUALIZE
        </button>

        <button className="reset-graph" onClick={() => handleResetGraphButton()}>
          Reset Graph
        </button>

        <hr className="rounded separator" />

        <h3 className="title-medium">Path Finders</h3>

        <div className="dropdown">
          <button className="dropbtn">
            {currentAlgorithm ? currentAlgorithm : "(Select Algorithm)"}
          </button>
          <div className="dropdown-content">
            <div className="dropdown-item" onClick={() => handleSelectAlgorithmBtn(EGraphAlgorithms.Dijkstra)}>
              Dijkstra
            </div>
            <div className="dropdown-item" onClick={() => handleSelectAlgorithmBtn(EGraphAlgorithms.Astar)}>
              A*
            </div>
          </div>
        </div>

        <div>
          <h4 className="title-small">Trace Search Speed</h4>
          <ul className="selector selector-normal selector-row">
            <li
              onClick={() => handleTraceSearchSpeedBtns(ETraceAnimationSpeed.SPEED_ONE)}
              className={traceSearchSpeed === ETraceAnimationSpeed.SPEED_ONE ? "selector-highlight" : "selector-normal"}
            >
              1
            </li>
            <li
              onClick={() => handleTraceSearchSpeedBtns(ETraceAnimationSpeed.SPEED_TWO)}
              className={traceSearchSpeed === ETraceAnimationSpeed.SPEED_TWO ? "selector-highlight" : "selector-normal"}
            >
              2
            </li>
            <li
              onClick={() => handleTraceSearchSpeedBtns(ETraceAnimationSpeed.SPEED_THREE)}
              className={traceSearchSpeed === ETraceAnimationSpeed.SPEED_THREE ? "selector-highlight" : "selector-normal"}
            >
              3
            </li>
          </ul>
        </div>

        <div>
          <h4 className="title-small">Trace Path Speed</h4>
          <ul className="selector selector-normal selector-row">
            <li
              onClick={() => handleTracePathSpeedBtns(ETraceAnimationSpeed.SPEED_ONE)}
              className={tracePathSpeed === ETraceAnimationSpeed.SPEED_ONE ? "selector-highlight" : "selector-normal"}
            >
              1
            </li>
            <li
              onClick={() => handleTracePathSpeedBtns(ETraceAnimationSpeed.SPEED_TWO)}
              className={tracePathSpeed === ETraceAnimationSpeed.SPEED_TWO ? "selector-highlight" : "selector-normal"}
            >
              2
            </li>
            <li
              onClick={() => handleTracePathSpeedBtns(ETraceAnimationSpeed.SPEED_THREE)}
              className={tracePathSpeed === ETraceAnimationSpeed.SPEED_THREE ? "selector-highlight" : "selector-normal"}
            >
              3
            </li>
          </ul>
        </div>

        <div className="start-end-selector-container">
          <div
            className={`selector ${
              selectedCellTypeToPlace === EGenericCellType.START ? "selector-highlight" : "selector-normal"
            }`}
            onClick={() => handleCellTypeToPlace(EGenericCellType.START)}
          >
            <div className="cell-start selector-icon"></div>
            <div>Set Start Cell</div>
          </div>

          <div
            className={`selector ${
              selectedCellTypeToPlace === EGenericCellType.FINISH ? "selector-highlight" : "selector-normal"
            }`}
            onClick={() => handleCellTypeToPlace(EGenericCellType.FINISH)}
          >
            <div className="cell-finish selector-icon"></div>
            <div>Set Finish Cell</div>
          </div>

          <div
            className={`selector ${
              selectedCellTypeToPlace === EGenericCellType.WALL ? "selector-highlight" : "selector-normal"
            }`}
            onClick={() => handleCellTypeToPlace(EGenericCellType.WALL)}
          >
            <div className="cell-wall selector-icon "></div>
            <div>Set Wall Cell</div>
          </div>

          <div
            className={`selector ${
              selectedCellTypeToPlace === EGenericCellType.NORMAL ? "selector-highlight" : "selector-normal"
            }`}
            onClick={() => handleCellTypeToPlace(EGenericCellType.NORMAL)}
          >
            <div className="cell-normal selector-icon "></div>
            <div>Set Normal Cell</div>
          </div>
        </div>

        <hr className="rounded separator" />

        <h3 className="title-medium">Maze Generation</h3>

        <div className="maze-generation-selectors-container">
          <div className="selector selector-normal" onClick={() => handleRecursiveBacktrackBtn()}>
            <img src={shuffleIcon} alt="shuffle icon" className="selector-icon" />
            <div>Recur. Backtrack</div>
          </div>
        </div>

        <div>
          <h4 className="title-small">Trace Maze Speed</h4>
          <ul className="selector selector-normal selector-row">
            <li
              onClick={() => handleTraceMazeGenerationSpeedBtns(ETraceAnimationSpeed.SPEED_ONE)}
              className={
                traceMazeGenerationSpeed === ETraceAnimationSpeed.SPEED_ONE
                  ? "selector-highlight"
                  : "selector-normal"
              }
            >
              1
            </li>
            <li
              onClick={() => handleTraceMazeGenerationSpeedBtns(ETraceAnimationSpeed.SPEED_TWO)}
              className={
                traceMazeGenerationSpeed === ETraceAnimationSpeed.SPEED_TWO
                  ? "selector-highlight"
                  : "selector-normal"
              }
            >
              2
            </li>
            <li
              onClick={() => handleTraceMazeGenerationSpeedBtns(ETraceAnimationSpeed.SPEED_THREE)}
              className={
                traceMazeGenerationSpeed === ETraceAnimationSpeed.SPEED_THREE
                  ? "selector-highlight"
                  : "selector-normal"
              }
            >
              3
            </li>
          </ul>
        </div>
      </div>

      {/* Scroll-safe, responsive container for the grid */}
      <div
        className="graphOuter"
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
      >
        <div className="graphWrapper">
          {graph.graph.map((row) =>
            row.map((item) => (
              <CellNode
                key={`${item.posCol}-${item.posRow}`}
                cellType={item.cellType}
                row={item.posRow}
                col={item.posCol}
                onMouseDown={handleCellClick}
                _onMouseEnter={handleMouseEnterCell}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
