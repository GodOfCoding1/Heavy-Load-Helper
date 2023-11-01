export class Queue<T> {
  public constructor(
    private elements: Record<number, T> = {},
    private head: number = 0,
    private tail: number = 0
  ) {}

  public enqueue(element: T): void {
    this.elements[this.tail] = element;
    this.tail++;
  }

  public dequeue(): T {
    const item = this.elements[this.head];
    delete this.elements[this.head];
    this.head++;

    return item;
  }

  public peek(): T {
    return this.elements[this.head];
  }

  public getlength(): number {
    return this.tail - this.head;
  }

  public isEmpty(): boolean {
    return this.getlength() === 0;
  }
}
