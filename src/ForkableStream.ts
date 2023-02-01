import { ControllableStream } from './ControllableStream'
import { identity } from './identity'
import { without } from './util/array'

export class ForkableStream<T> extends WritableStream<T> {
  #error?: any
  #finished = false
  #controllers: ControllableStream<T>[] = []

  /**
   * One WritableStream to many ReadableStreams.
   */
  constructor(
    underlyingSink?: UnderlyingSink<T>,
    strategy?: QueuingStrategy<T>
  ) {
    super(
      {
        ...underlyingSink,

        abort: (reason) => {
          this.#forEachController((controller) => controller.error(reason))
          this.#controllers = []
          this.#error = reason
          this.#finished = true
          return underlyingSink?.abort?.(reason)
        },

        close: () => {
          this.#forEachController((controller) => {
            try {
              controller.close()
            } catch (error) {
              // potentially already closed
            }
          })
          this.#controllers = []
          this.#finished = true
          return underlyingSink?.close?.()
        },

        write: (chunk, controller) => {
          this.#forEachController((controller) => controller.enqueue(chunk))
          return underlyingSink?.write?.(chunk, controller)
        },
      },

      strategy
    )
  }

  get finished() {
    return this.#finished
  }

  fork() {
    return this._pipeThroughController(this._addController())
  }

  #forEachController(fn: (controller: ControllableStream<T>) => void) {
    for (const controller of this.#controllers) fn(controller)
  }

  protected _addController() {
    const controller = new ControllableStream<T>({
      cancel: () => {
        this.#controllers = without(this.#controllers, controller)
      },
    })
    if (!this.#finished) this.#controllers.push(controller)
    return controller
  }

  protected _pipeThroughController(controller: ControllableStream<T>) {
    if (this.#error) controller.error(this.#error)
    else if (this.#finished) controller.close()
    return controller.pipeThrough(identity())
  }
}
