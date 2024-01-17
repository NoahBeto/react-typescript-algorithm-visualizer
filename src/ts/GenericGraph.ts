import { PriorityQueue } from "./PriorityQueue";
import { EHeuristic } from "./enums/GenericGraph.enums";
import {
  TGenericCellMatrix,
  TGenericGraphConstructor,
} from "./types/GenericGraph.types";
import { GenericCell } from "./GenericCell";
import { EGenericCellType, TCoords } from "./types/GenericCell.types";
import { TGraph } from "./types/GraphHelper.types";
import { TCell } from "./types/Cell.types";

export class GenericGraph {
  importedGraph: TGraph;
  graph: TGenericCellMatrix;
  readonly ROWS: number;
  readonly COLS: number;
  private startCell: GenericCell | undefined;
  private finishCell: GenericCell | undefined;
  private diagonalAllowed: boolean;
  private heuristic: EHeuristic;
  private weight: number;
  private includeStartCell: boolean;
  private inlcudeFinishCell: boolean;
  private allowPathAsCloseAsPossible: boolean;

  constructor(args: TGenericGraphConstructor) {
    this.importedGraph = args.importedGraph;
    this.graph = [];
    this.ROWS = args.rows;
    this.COLS = args.cols;
    this.startCell = new GenericCell({
      position: {
        x: this.importedGraph.startCell!.posCol,
        y: this.importedGraph.startCell!.posRow,
      },
      type: EGenericCellType.FINISH,
    });
    this.finishCell = new GenericCell({
      position: {
        x: this.importedGraph.finishCell!.posCol,
        y: this.importedGraph.finishCell!.posRow,
      },
      type: EGenericCellType.FINISH,
    });
    this.diagonalAllowed = args.diagonalAllowed || false;
    this.heuristic = args.heuristic || EHeuristic.MANHATTEN;
    this.weight = args.weight || 1;
    this.includeStartCell = args.includeStartCell || true;
    this.inlcudeFinishCell = args.includeFinishCell || true;
    this.allowPathAsCloseAsPossible = args.allowPathAsCloseAsPossible || false;
  }

  dijkstra = (): {
    shortestPath: TCell[];
    visited: TCell[];
  } => {
    if (!this.startCell || !this.finishCell) {
      throw new Error("no start or finish cell");
    }
    this.initializeGraph();
    const distances: { [key: string]: number } = {};
    const visited: { [key: string]: boolean } = {};
    const visitedCells: GenericCell[] = [];
    const priorityQueue = new PriorityQueue<GenericCell>();

    //initialize all cells with distance infinity and visited false
    for (let y = 0; y < this.graph.length; y++) {
      for (let x = 0; x < this.graph[y].length; x++) {
        const cell = this.getCell({ x, y });

        distances[cell!.toString()] = Infinity;
        visited[cell!.toString()] = false;
      }
    }

    // set start cell properties according to dijkstra
    distances[this.startCell.toString()] = 0;
    priorityQueue.enqueue(this.startCell, 0);

    while (!priorityQueue.isEmpty()) {
      const currentCell: GenericCell = priorityQueue.dequeue();

      if (visited[currentCell.toString()]) continue;
      visited[currentCell.toString()] = true;

      visitedCells.push(currentCell);

      for (const neighbor of this.getNeighbors(currentCell.getPosition())) {
        const newDistance = distances[currentCell.toString()] + 1;
        if (newDistance < distances[neighbor.toString()]) {
          distances[neighbor.toString()] = newDistance;
          priorityQueue.enqueue(neighbor, newDistance);
        }
      }
    }

    // check if finish cell has been visited
    if (!visited[this.finishCell.toString()]) {
      throw new Error("No path from start to finish cell");
    }

    let shortestPath: GenericCell[] = this.dijkstraBacktrack(distances);

    let newShortestPath: TCell[] = [];
    for (let i = 0; i < shortestPath.length; i++) {
      newShortestPath.push({
        posRow: shortestPath[i].getPosition().y,
        posCol: shortestPath[i].getPosition().x,
        cellType: shortestPath[i].getType(),
      });
    }

    let newVisited: TCell[] = [];
    for (let i = 0; i < visitedCells.length; i++) {
      newVisited.push({
        posRow: visitedCells[i].getPosition().y,
        posCol: visitedCells[i].getPosition().x,
        cellType: visitedCells[i].getType(),
      });
    }
    return { shortestPath: newShortestPath, visited: newVisited };
  };

  dijkstraBacktrack = (distances: { [key: string]: number }): GenericCell[] => {
    if (!this.startCell || !this.finishCell) {
      throw new Error("no start or finish cell");
    }

    const path: GenericCell[] = [];
    let currentCell: GenericCell = this.finishCell;

    while (currentCell.toString() !== this.startCell.toString()) {
      path.unshift(currentCell);
      const neighbors = this.getNeighbors(currentCell.getPosition());
      const nextCell = neighbors.reduce((minDistanceCell, neighbor) => {
        const neighborDistance = distances[neighbor.toString()];
        const minDistance = distances[minDistanceCell.toString()];

        if (neighborDistance < minDistance) {
          return neighbor;
        } else {
          return minDistanceCell;
        }
      }, neighbors[0]);
      currentCell = nextCell;
    }
    path.unshift(this.startCell);

    return path;
  };

  getCell = (coords: TCoords): GenericCell | undefined => {
    if (
      coords.y < 0 ||
      coords.y > this.graph.length - 1 ||
      coords.x < 0 ||
      coords.x > this.graph[coords.y].length - 1
    ) {
      return undefined;
    }

    return this.graph[coords.y][coords.x];
  };

  getNeighbors = (coords: TCoords): GenericCell[] => {
    const neighbors: GenericCell[] = [];
    let curr: GenericCell | undefined;

    // get top neighbor
    curr = this.getCell({ x: coords.x, y: coords.y - 1 });
    if (curr && curr.isWalkable()) {
      neighbors.push(curr);
    }

    // get right neighbor
    curr = this.getCell({ x: coords.x + 1, y: coords.y });
    if (curr && curr.isWalkable()) {
      neighbors.push(curr);
    }

    // get bottom neighbor
    curr = this.getCell({ x: coords.x, y: coords.y + 1 });
    if (curr && curr.isWalkable()) {
      neighbors.push(curr);
    }

    // get left neighbor
    curr = this.getCell({ x: coords.x - 1, y: coords.y });
    if (curr && curr.isWalkable()) {
      neighbors.push(curr);
    }

    return neighbors;
  };

  initializeGraph = (): void => {
    let res: TGenericCellMatrix = [];
    for (let i = 0; i < this.ROWS; i++) {
      let row: GenericCell[] = [];
      for (let j = 0; j < this.COLS; j++) {
        row.push(
          new GenericCell({
            position: { x: j, y: i },
            type: this.importedGraph.graph[i][j].cellType,
          })
        );
      }
      res.push(row);
    }
    this.graph = res;
  };
}
