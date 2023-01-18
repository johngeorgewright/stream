import { ForkableStream } from './ForkableStream'

export class ForkableBehaviorStream<T> extends ForkableStream<T> {
  #chunk?: T

  constructor() {
    super({
      write: (chunk) => {
        this.#chunk = chunk
      },
    })
  }

  override fork() {
    const controller = this._addController()
    if (this.#chunk !== undefined) controller.enqueue(this.#chunk)
    return this._pipeThroughController(controller)
  }
}
