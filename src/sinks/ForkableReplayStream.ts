import { ForkableStream } from './ForkableStream'

/**
 * An extension to the {@link ForkableStream:class} that immediately
 * queues the entire contents of whatever has been previously consumed.
 *
 * @group Sinks
 * @todo Implement a maximum size to be kept in memory
 * @example
 * ```
 * const forkable = new ForkableReplayStream<number>()
 * await fromIterable([1, 2, 3, 4, 5, 6, 7]).pipeTo(forkable)
 * ```
 *
 * Now the stream has finished, if we fork from it we'll
 * receive the entire events that were published to it.
 *
 * ```
 * await forkable.fork().pipeTo(write(console.info))
 * // 1, 2, 3, 4, 5, 6, 7
 * ```
 */
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
