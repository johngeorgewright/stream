import { Subject } from './Subject'
import { tap } from './tap'

export class ReplaySubject<T> extends Subject<T> {
  #chunks: T[] = []

  constructor(readable: ReadableStream<T>) {
    super(readable.pipeThrough(tap((chunk) => this.#chunks.push(chunk))))
  }

  override subscribe() {
    const controller = this.addController()
    for (const chunk of this.#chunks) controller.enqueue(chunk)
    return this.subscribeToController(controller)
  }
}
