import { empty, Empty } from '../utils/Symbol'
import { ForkableStream } from './ForkableStream'

/**
 * An extension to the {@link ForkableStream:class} that immediately
 * queues the last received chunk to any fork.
 *
 * @group Sinks
 * @example
 * ```
 * const forkable = new ForkableRecallStream<number>()
 * await fromCollection([1, 2, 3, 4, 5, 6, 7]).pipeTo(forkable)
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
  #chunk: T | Empty = empty

  constructor(
    underlyingSink?: UnderlyingSink<T>,
    strategy?: QueuingStrategy<T>
  ) {
    super(
      {
        ...underlyingSink,
        write: (chunk, controller) => {
          this.#chunk = chunk
          underlyingSink?.write?.(chunk, controller)
        },
      },
      strategy
    )
  }

  protected override _addController(
    underlyingSource?: UnderlyingDefaultSource<T>,
    queuingStrategy?: QueuingStrategy<T>
  ) {
    const controller = super._addController(underlyingSource, queuingStrategy)
    if (this.#chunk !== empty) controller.enqueue(this.#chunk)
    return controller
  }
}
