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

        async start($controller) {
          controller = $controller
          await underlyingSource?.start?.($controller)
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
