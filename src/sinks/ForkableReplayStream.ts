import { ForkableStream } from './ForkableStream'

/**
 * An extension to the {@link ForkableStream:class} that immediately
 * queues the entire contents of whatever has been previously consumed.
 *
 * @group Sinks
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
 * // 1
 * // 2
 * // 3
 * // 4
 * // 5
 * // 6
 * // 7
 * ```
 */
export class ForkableReplayStream<T> extends ForkableStream<T> {
  #chunks: T[] = []

  constructor(
    maxReplaySize = Number.MAX_SAFE_INTEGER,
    underlyingSink?: UnderlyingSink<T>,
    strategy?: QueuingStrategy<T>
  ) {
    super(
      {
        ...underlyingSink,
        write: (chunk, controller) => {
          if (this.#chunks.length === maxReplaySize) this.#chunks.shift()
          this.#chunks.push(chunk)
          underlyingSink?.write?.(chunk, controller)
        },
      },
      strategy
    )
  }

  override fork(
    underlyingSource?: UnderlyingDefaultSource<T>,
    queuingStrategy?: QueuingStrategy
  ) {
    const controller = this._addController(underlyingSource, queuingStrategy)
    for (const chunk of this.#chunks) controller.enqueue(chunk)
    return this._pipeThroughController(controller)
  }

  clear() {
    this.#chunks = []
  }
}
