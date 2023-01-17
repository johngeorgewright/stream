import { Subject, SubjectSubscription } from './Subject'
import { tap } from './tap'

export class BehaviorSubject<T> extends Subject<T> {
  #chunk?: T

  constructor(readable: ReadableStream<T>) {
    super(readable.pipeThrough(tap((chunk) => (this.#chunk = chunk))))
  }

  override subscribe(
    subscription: SubjectSubscription<T>,
    errorHandler?: SubjectSubscription<any>
  ) {
    if (this.#chunk !== undefined) subscription(this.#chunk)
    return super.subscribe(subscription, errorHandler)
  }
}
