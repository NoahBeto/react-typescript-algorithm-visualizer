/**
 * The following code is based on the javascript-astar library by bgrins.
 * Original repository: https://github.com/bgrins/javascript-astar
 * License: Copyright (c) Brian Grinstead, http://briangrinstead.com
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import { BinaryHeap } from "./BinaryHeap";
import { GenericCell } from "./GenericCell";
import { EHeuristic } from "./enums/GenericGraph.enums";
import { TCoords } from "./types/GenericCell.types";
import { TGenericCellMatrix } from "./types/GenericGraph.types";

export class Astar {
  private graph: TGenericCellMatrix;
  private startCell: GenericCell;
  private finishCell: GenericCell;
  private heuristic: EHeuristic;
  private openHeap: BinaryHeap;
  private dirtyCells: GenericCell[];
  private allowClosest: boolean;
  constructor(args: AstarConstructor) {
    this.graph = args.graph;
    this.startCell = args.startCell;
    this.finishCell = args.finishCell;
    this.heuristic = args.heuristic | EHeuristic.MANHATTEN;
    this.openHeap = new BinaryHeap({
      scoreFunction: (cell: GenericCell) => {
        return cell.getF();
      },
    });
    this.dirtyCells = [];
    this.allowClosest = args.closest || false;
  }

  search = (): { shortestPath: GenericCell[]; visited: GenericCell[] } => {
    this.startCell.setH(
      this.heuristics[this.heuristic](
        this.startCell.getPosition(),
        this.finishCell.getPosition()
      )
    );
    this.dirtyCells.push(this.startCell);
    this.openHeap.push(this.startCell);
    let closestCell = this.startCell;

    while (this.openHeap.size() > 0) {
      // Grab the lowest f(x) to process next.  Heap keeps this sorted for us.
      let currentCell = this.openHeap.pop();

      // End case -- result has been found, return the traced path.
      if (
        currentCell.getPosition().x === this.finishCell.getPosition().x &&
        currentCell.getPosition().y === this.finishCell.getPosition().y
      ) {
        return {
          shortestPath: this.pathTo(currentCell),
          visited: this.dirtyCells,
        };
      }

      // Normal case -- move currentCell from open to closed, process each of its neighbors.
      currentCell.setClosed(true);

      // Find all neighbors for the current cell
      let neighbors: GenericCell[] = this.getNeighbors(
        currentCell.getPosition()
      );

      for (let i = 0; i < neighbors.length; i++) {
        let neighbor = neighbors[i];

        if (neighbor.isClosed() || !neighbor.isWalkable()) {
          continue;
        }

        // The g score is the shortest distance from start to current node.
        // We need to check if the path we have arrived at this neighbor is the shortest one we have seen yet.
        let gScore: number = currentCell.getG() + neighbor.getCost(currentCell);
        let isVisited: boolean = neighbor.isVisited();

        if (!isVisited || gScore < neighbor.getG()) {
          // Found an optimal (so far) path to this node.  Take score for node to see how good it is.
          neighbor.setVisited(true);
          neighbor.setParent(currentCell);
          neighbor.setH(
            neighbor.getH() ||
              this.heuristics[this.heuristic](
                neighbor.getPosition(),
                this.finishCell.getPosition()
              )
          );
          neighbor.setG(gScore);
          neighbor.setF(neighbor.getG() + neighbor.getH());
          this.dirtyCells.push(neighbor);
          if (this.allowClosest) {
            // If the neighbour is closer than the current closestNode or if it's equally close but has
            // a cheaper path than the current closest node then it becomes the closest node
            if (
              neighbor.getH() < closestCell.getH() ||
              (neighbor.getH() === closestCell.getH() &&
                neighbor.getG() < closestCell.getG())
            ) {
              closestCell = neighbor;
            }
          }

          if (!isVisited) {
            // Pushing to heap will put it in proper place based on the 'f' value.
            this.openHeap.push(neighbor);
          } else {
            // Already seen the node, but since it has been rescored we need to reorder it in the heap
            this.openHeap.rescoreElement(neighbor);
          }
        }
      }
    }

    if (this.allowClosest) {
      return {
        shortestPath: this.pathTo(closestCell),
        visited: this.dirtyCells,
      };
    }

    return { shortestPath: [], visited: [] };
  };

  pathTo = (cell: GenericCell): GenericCell[] => {
    let path: GenericCell[] = [];
    let curr: GenericCell = cell;

    while (curr.getParent()) {
      path.unshift(curr);
      curr = curr.getParent()!;
    }

    return path;
  };

  getNeighbors = (coords: TCoords): GenericCell[] => {
    const neighbors: GenericCell[] = [];
    let curr: GenericCell | undefined;

    // get top neighbor
    curr = this.getCell({ x: coords.x, y: coords.y - 1 });
    if (curr) {
      neighbors.push(curr);
    }

    // get right neighbor
    curr = this.getCell({ x: coords.x + 1, y: coords.y });
    if (curr) {
      neighbors.push(curr);
    }

    // get bottom neighbor
    curr = this.getCell({ x: coords.x, y: coords.y + 1 });
    if (curr) {
      neighbors.push(curr);
    }

    // get left neighbor
    curr = this.getCell({ x: coords.x - 1, y: coords.y });
    if (curr) {
      neighbors.push(curr);
    }

    return neighbors;
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

  heuristics = {
    [EHeuristic.MANHATTEN]: (pos0: TCoords, pos1: TCoords) => {
      let d1 = Math.abs(pos1.x - pos0.x);
      let d2 = Math.abs(pos1.y - pos0.y);
      return d1 + d2;
    },
  };
}

type AstarConstructor = {
  graph: TGenericCellMatrix;
  startCell: GenericCell;
  finishCell: GenericCell;
  heuristic: EHeuristic;
  closest: boolean;
};
