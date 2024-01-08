export class PriorityQueue<T> {
  queue: { element: T; priority: number }[] = [];

  enqueue(element: T, priority: number): void {
    this.queue.push({ element, priority });
    this.sort();
  }

  dequeue(): T {
    const removedItem = this.queue.shift();
    if (removedItem === undefined)
      throw new Error("Priority queue dequeued undefined");
    return removedItem.element;
  }

  isEmpty(): boolean {
    return this.queue.length === 0;
  }

  private sort(): void {
    this.queue.sort((a, b) => a.priority - b.priority);
  }
}

// Example usage:
// const priorityQueue = new PriorityQueue<number>();

// priorityQueue.enqueue(5, 2);
// priorityQueue.enqueue(8, 1);
// priorityQueue.enqueue(3, 4);

// while (!priorityQueue.isEmpty()) {
//   const element = priorityQueue.dequeue();
//   console.log(element);
// }
