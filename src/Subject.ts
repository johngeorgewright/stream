import { defer } from '@johngw/async'
import { without } from 'lodash'
import { open } from './open'

export class Subject<T> {
  #subscriptions: SubjectSubscription<T>[] = []
  #errorHandlers: SubjectSubscription<any>[] = []
  #finished: Promise<void>
  #finish: () => void
  #error: (error: any) => void
  #readable: ReadableStream<T>

  constructor(readable: ReadableStream<T>) {
    const { promise: finished, resolve: finish, reject: error } = defer()
    this.#finish = finish
    this.#finished = finished
    this.#error = error

    this.#readable = readable.pipeThrough(
      new TransformStream<T, T>({
        transform: (chunk, controller) => {
          emit(chunk, this.#subscriptions)
          controller.enqueue(chunk)
        },

        flush: () => {
          this.#subscriptions = []
          this.#errorHandlers = []
        },
      })
    )
  }

  get finished() {
    return this.#finished
  }

  #open() {
    open(this.#readable)
      .then(() => this.#finish())
      .catch((error) => {
        emit(error, this.#errorHandlers)
        this.#error(error)
      })
  }

  subscribe(
    subscription: SubjectSubscription<T>,
    errorHandler?: SubjectSubscription<any>
  ) {
    this.#subscriptions.push(subscription)
    if (errorHandler) this.#errorHandlers.push(errorHandler)
    if (!this.#readable.locked) this.#open()
    return () => {
      if (errorHandler)
        this.#errorHandlers = without(this.#errorHandlers, errorHandler)
      this.#subscriptions = without(this.#subscriptions, subscription)
    }
  }
}

export type SubjectSubscription<T> = (chunk: T) => any

function emit<T>(chunk: T, subscriptions: SubjectSubscription<T>[]) {
  for (const subscription of subscriptions) subscription(chunk)
}
