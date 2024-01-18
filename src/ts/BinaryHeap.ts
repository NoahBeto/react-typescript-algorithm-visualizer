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

import { GenericCell } from "./GenericCell";

export class BinaryHeap {
  private content: GenericCell[] = [];
  private scoreFunction!: (cell: GenericCell) => number;
  constructor(args: BinaryHeapConstructor) {
    this.content = [];
    this.scoreFunction = args.scoreFunction;
  }

  push = (element: GenericCell) => {
    this.content.push(element);
    this.sinkDown(this.content.length - 1);
  };

  pop = (): GenericCell => {
    // Store the first element so we can return it later.
    let result = this.content[0];
    // Get the element at the end of the array.
    let end = this.content.pop();
    // If there are any elements left, put the end element at the
    // start, and let it bubble up.
    if (this.content.length > 0) {
      this.content[0] = end!;
      this.bubbleUp(0);
    }

    return result;
  };

  remove = (cell: GenericCell) => {
    let i = this.content.indexOf(cell);

    // When it is found, the process seen in 'pop' is repeated
    // to fill up the hole.
    let end = this.content.pop();

    if (i !== this.content.length - 1) {
      this.content[i] = end!;

      if (this.scoreFunction(cell) < this.scoreFunction(cell)) {
        this.sinkDown(i);
      } else {
        this.bubbleUp(i);
      }
    }
  };

  size = () => {
    return this.content.length;
  };

  rescoreElement = (cell: GenericCell) => {
    return this.sinkDown(this.content.indexOf(cell));
  };

  sinkDown = (n: number) => {
    // Fetch the element that has to be sunk.
    let element = this.content[n];

    // When at 0, an element can not sink any further.
    while (n > 0) {
      // Compute the parent element's index, and fetch it.
      let parentN = ((n + 1) >> 1) - 1;
      let parent = this.content[parentN];

      // Swap the elements if the parent is greater.
      if (this.scoreFunction(element) < this.scoreFunction(parent)) {
        this.content[parentN] = element;
        this.content[n] = parent;

        // Update 'n' to continue at the new position.
        n = parentN;
      }

      // Found a parent that is less, no need to sink any further.
      else {
        break;
      }
    }
  };

  bubbleUp = (n: number) => {
    let length = this.content.length;
    let element = this.content[n];
    let elemScore = this.scoreFunction(element);

    while (true) {
      // Look up the target element and its score.
      // Compute the indices of the child elements.s
      let child2N = (n + 1) << 1;
      let child1N = child2N - 1;

      // This is used to store the new position of the element, if any.
      let swap = null;
      let child1Score;

      // If the first child exists (is inside the array)...
      if (child1N < length) {
        let child1 = this.content[child1N];
        child1Score = this.scoreFunction(child1);

        // If the score is less than our element's, we need to swap.
        if (child1Score < elemScore) {
          swap = child1N;
        }
      }

      // Do the same checks for the other child.
      if (child2N < length) {
        var child2 = this.content[child2N];
        var child2Score = this.scoreFunction(child2);
        if (child2Score < (swap === null ? elemScore : child1Score!)) {
          swap = child2N;
        }
      }

      // If the element needs to be moved, swap it, and continue.
      if (swap !== null) {
        this.content[n] = this.content[swap];
        this.content[swap] = element;
        n = swap;
      }
      // Otherwise, we are done.
      else {
        break;
      }
    }
  };
}

type BinaryHeapConstructor = {
  scoreFunction: (cell: GenericCell) => number;
};
