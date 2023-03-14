import { without } from '../utils/Array.js'
import { Controllable, ControllerPullListener } from './Controllable.js'

/**
 * A ControllableStream is ReadableStream that can have chunks
 * queued to from an external source.
 *
 * @group Sources
 * @example
 * Queuing items externally.
 *
 * ```
 * const controller = new ControllableStream<number>()
 * controller.enqueue(1)
 * controller.enqueue(2)
 * controller.enqueue(3)
 * controller.close()
 * ```
 *
 * Registering pull subscribers externally.
 *
 * ```
 * const controller = new ControllableStream<number>()
 * let i = -1
 * controller.onPull(() => ++i)
 * ```
 */
export class ControllableStream<T>
  extends ReadableStream<T>
  implements Controllable<T>
{
  #controller: ReadableStreamDefaultController<T>
  #pullListeners: ControllerPullListener<T>[] = []

  constructor(
    underlyingSource?: UnderlyingDefaultSource<T>,
    strategy?: QueuingStrategy<T>
  ) {
    let controller: ReadableStreamDefaultController<T>

    super(
      {
        ...underlyingSource,

        start($controller) {
          controller = $controller
          return underlyingSource?.start?.($controller)
        },

        pull: async (controller) => {
          await this.#pull(controller)
          return underlyingSource?.pull?.(controller)
        },
      },
      strategy
    )

    /*
    TypeScript does not know that the `underlyingSource`'s `start`
    function is called during construction.
    */
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    this.#controller = controller!
  }

  get desiredSize() {
    return this.#controller.desiredSize
  }

  /**
   * Register a pull subscriber.
   *
   * @remark
   * When the stream is ready to pull it will pull from all
   * subscribers until the desired size has been fulfilled.
   */
  onPull(pullListener: ControllerPullListener<T>) {
    this.#pullListeners.push(pullListener)

    return () => {
      this.#pullListeners = without(this.#pullListeners, pullListener)
    }
  }

  error(error?: unknown) {
    this.#controller.error(error)
  }

  enqueue(chunk: T) {
    this.#controller.enqueue(chunk)
  }

  close() {
    this.#controller.close()
  }

  #pull(controller: ReadableStreamDefaultController<T>) {
    if (!this.#pullListeners.length) return
    /*
    At first glance you may wonder why we're not using
    Promise.all. This is because we have no idea how long 
    each pullListener is going to take and we may want to 
    fill the desired size before all listeners have resolved. 
    Therefore we resolve when the 1st listener queues an item 
    so the stream can request more if it needs.
    */
    return new Promise<void>((resolve) => {
      this.#pullListeners.forEach(async (pullListener) => {
        try {
          controller.enqueue(await pullListener())
        } catch (error) {
          controller.error(error)
        } finally {
          resolve()
        }
      })
    })
  }
}
