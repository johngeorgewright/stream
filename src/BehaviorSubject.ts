import { Subject } from './Subject'
import { tap } from './tap'

export class BehaviorSubject<T> extends Subject<T> {
  #chunk?: T

  constructor(readable: ReadableStream<T>) {
    super(readable.pipeThrough(tap((chunk) => (this.#chunk = chunk))))
  }

  override subscribe() {
    const controller = this.addController()
    if (this.#chunk !== undefined) controller.enqueue(this.#chunk)
    return this.subscribeToController(controller)
  }
}
