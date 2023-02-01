import { ForkableStream } from './ForkableStream'

export class ForkableReplayStream<T> extends ForkableStream<T> {
  #chunks: T[] = []

  constructor() {
    super({
      write: (chunk) => {
        this.#chunks.push(chunk)
      },
    })
  }

  override fork() {
    const controller = this._addController()
    for (const chunk of this.#chunks) controller.enqueue(chunk)
    return this._pipeThroughController(controller)
  }

  clear() {
    this.#chunks = []
  }
}
