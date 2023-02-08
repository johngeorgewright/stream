import { without } from '../util/array'

/**
 * A ControllableStream is ReadableStream that can have chunks
 * queued to from an external source.
 *
 * @group Sources
 * @example
 * ```
 * const controller = new ControllableStream<number>()
 * controller.enqueue(1)
 * controller.enqueue(2)
 * controller.enqueue(3)
 * controller.close()
 * ```
 */
export class ControllableStream<T> extends ReadableStream<T> {
  #controller: ReadableStreamDefaultController<T>
  #pullListeners: PullListener<T>[] = []
  #pullListenerIndex = 0

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

    // TypeScript does not know that the `underlyingSource`'s `start`
    // function is called during construction.
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    this.#controller = controller!
  }

  get desiredSize() {
    return this.#controller.desiredSize
  }

  onPull(pullListener: PullListener<T>) {
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

  async #pull(controller: ReadableStreamDefaultController<T>): Promise<void> {
    if (this.#pullListenerIndex === this.#pullListeners.length)
      this.#pullListenerIndex = 0

    if (this.#pullListenerIndex in this.#pullListeners) {
      controller.enqueue(await this.#pullListeners[this.#pullListenerIndex++]())
      // If the stream is pulling, then it has a desired size to fulfill.
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      if (controller.desiredSize! > 0) return this.#pull(controller)
    }
  }
}

interface PullListener<T> {
  (): T | Promise<T>
}
