import { Subject, SubjectSubscription } from './Subject'
import { tap } from './tap'

export class ReplaySubject<T> extends Subject<T> {
  #chunks: T[] = []

  constructor(readable: ReadableStream<T>) {
    super(readable.pipeThrough(tap((chunk) => this.#chunks.push(chunk))))
  }

  override subscribe(
    subscription: SubjectSubscription<T>,
    errorHandler?: SubjectSubscription<any>
  ) {
    for (const chunk of this.#chunks) subscription(chunk)
    return super.subscribe(subscription, errorHandler)
  }
}
