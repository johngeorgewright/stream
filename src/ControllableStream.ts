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
          underlyingSource?.start?.($controller)
        },
      },
      strategy
    )

    this.#controller = controller!
  }

  enqueue(chunk: T) {
    this.#controller.enqueue(chunk)
  }

  close() {
    this.#controller.close()
  }
}
