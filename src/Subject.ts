import { without } from 'lodash'
import { ControllableStream } from './ControllableStream'
import { identity } from './identity'

export class Subject<T> {
  #error?: any
  #finished = false
  #controllers: ControllableStream<T>[] = []
  #readable: ReadableStream<T>

  constructor(readable: ReadableStream<T>) {
    this.#readable = readable
  }

  get finished() {
    return this.#finished
  }

  #forEachController(fn: (controller: ControllableStream<T>) => void) {
    for (const controller of this.#controllers) fn(controller)
  }

  #open() {
    this.#readable
      .pipeTo(
        new WritableStream({
          abort: (reason) =>
            this.#forEachController((controller) => controller.error(reason)),
          close: () =>
            this.#forEachController((controller) => {
              try {
                controller.close()
              } catch (error) {
                // potentially already closed
              }
            }),
          write: (chunk) =>
            this.#forEachController((controller) => controller.enqueue(chunk)),
        })
      )
      .catch((error) => {
        this.#error = error
        this.#forEachController((controller) => controller.error(error))
      })
      .finally(() => {
        this.#finished = true
      })
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
    else if (!this.#readable.locked) this.#open()
    return controller.pipeThrough(identity())
  }

  subscribe() {
    return this.subscribeToController(this.addController())
  }
}
