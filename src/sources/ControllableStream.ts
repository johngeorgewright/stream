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
      },
      strategy
    )

    this.#controller = controller!
  }

  error(error?: any) {
    this.#controller.error(error)
  }

  enqueue(chunk: T) {
    this.#controller.enqueue(chunk)
  }

  close() {
    this.#controller.close()
  }
}
