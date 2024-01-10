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
