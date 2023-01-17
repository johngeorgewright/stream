import { without } from 'lodash'
import { ControllableStream } from './ControllableStream'
import { identity } from './identity'
import { open } from './open'

export class Subject<T> {
  #error?: any
  #finished = false
  #controllers: ControllableStream<T>[] = []
  #readable: ReadableStream<T>

  constructor(readable: ReadableStream<T>) {
    this.#readable = readable.pipeThrough(
      new TransformStream<T, T>({
        transform: (chunk, controller) => {
          this.#enqueue(chunk)
          controller.enqueue(chunk)
        },

        flush: () => {
          this.#forEachSubscription((subscription) => subscription.close())
          this.#controllers = []
        },
      })
    )
  }

  get finished() {
    return this.#finished
  }

  #forEachSubscription(fn: (subscription: ControllableStream<T>) => void) {
    for (const subscription of this.#controllers) fn(subscription)
  }

  #enqueue(chunk: T) {
    this.#forEachSubscription((subscription) => subscription.enqueue(chunk))
  }

  #open() {
    open(this.#readable)
      .catch((error) => {
        this.#error = error
        this.#forEachSubscription((subscription) => subscription.error(error))
        throw error
      })
      .finally(() => (this.#finished = true))
  }

  protected addController() {
    const controller = new ControllableStream<T>({
      cancel: () => {
        this.#controllers = without(this.#controllers, controller)
      },
    })
    this.#controllers.push(controller)
    return controller
  }

  protected subscribeToController(controller: ControllableStream<T>) {
    if (this.#error) controller.error(this.#error)
    else if (this.#finished) controller.close()
    if (!this.#readable.locked) this.#open()
    return controller.pipeThrough(identity())
  }

  subscribe() {
    return this.subscribeToController(this.addController())
  }
}
