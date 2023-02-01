import { ForkableStream } from './ForkableStream'

/**
 * An extension to the {@link ForkableStream:class} that immediately
 * queues the last received chunk to any fork.
 *
 * @group Sinks
 * @example
 * ```
 * const forkable = new ForkableRecallStream<number>()
 * await fromIterable([1, 2, 3, 4, 5, 6, 7]).pipeTo(forkable)
 * ```
 *
 * Now the stream has finished, if we fork from it we'll
 * receive the last thing that was emitted.
 *
 * ```
 * await forkable.fork().pipeTo(write(console.info))
 * // 7
 * ```
 */
export class ForkableRecallStream<T> extends ForkableStream<T> {
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
