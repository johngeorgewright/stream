import { ControllableStream } from '../sources/ControllableStream'
import { identity } from '../transformers/identity'
import { without } from '../util/array'
import { Forkable } from './Forkable'

/**
 * A ForkableStream is "1 Writeable to many Readables".
 *
 * @group Sinks
 * @example
 * ```
 * const forkable = new ForkableStream<T>()
 *
 * fromIterable([1, 2, 3, 4, 5, 6, 7]).pipeTo(forkable)
 *
 * forkable.fork().pipeTo(write(x => console.info('fork1', x)))
 * // fork1 1, fork1 2, fork1 3, fork1 4, fork1 5, fork1 6, fork1 7
 *
 * forkable.fork().pipeTo(write(x => console.info('fork2', x)))
 * // fork2 1, fork2 2, fork2 3, fork2 4, fork2 5, fork2 6, fork2 7
 * ```
 */
export class ForkableStream<T>
  extends WritableStream<T>
  implements Forkable<T>
{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  #error?: any
  #finished = false
  #controllers: ControllableStream<T>[] = []

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
              controller.cancel()
            } catch (error) {
              // potentially already closed
            }
          })
          this.#controllers = []
          this.#finished = true
          return underlyingSink?.close?.()
        },

        write: (chunk, controller) => {
          this.#forEachController(
            (controller) => controller.desiredSize && controller.enqueue(chunk)
          )
          return underlyingSink?.write?.(chunk, controller)
        },
      },

      strategy
    )
  }

  get finished() {
    return this.#finished
  }

  fork(queuingStrategy?: QueuingStrategy) {
    return this._pipeThroughController(this._addController(queuingStrategy))
  }

  #forEachController(fn: (controller: ControllableStream<T>) => void) {
    for (const controller of this.#controllers) fn(controller)
  }

  protected _addController(queuingStrategy?: QueuingStrategy) {
    const controller = new ControllableStream<T>(
      {
        cancel: () => {
          this.#controllers = without(this.#controllers, controller)
        },
      },
      queuingStrategy
    )
    if (!this.#finished) this.#controllers.push(controller)
    return controller
  }

  protected _pipeThroughController(controller: ControllableStream<T>) {
    if (this.#error) controller.error(this.#error)
    else if (this.#finished) controller.close()
    return controller.pipeThrough(identity())
  }
}
