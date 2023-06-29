import { Clearable } from '@johngw/stream/types/Clearable'
import { BaseForkableStream } from '@johngw/stream/sinks/BaseForkableStream'
import { ForkableReplaySink } from '@johngw/stream/sinks/ForkableReplaySink'
import { ForkableStream } from '@johngw/stream/sinks/ForkableStream'

/**
 * An extension to the {@link ForkableStream:class} that immediately
 * queues the entire contents of whatever has been previously consumed.
 *
 * @group Sinks
 * @see {@link ForkableReplaySink}
 * @example
 * ```
 * const forkable = new ForkableReplayStream<number>()
 * await fromCollection([1, 2, 3, 4, 5, 6, 7]).pipeTo(forkable)
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
export class ForkableReplayStream<T>
  extends BaseForkableStream<T, ForkableReplaySink<T>>
  implements Clearable
{
  constructor(maxReplaySize?: number, strategy?: QueuingStrategy<T>) {
    super(new ForkableReplaySink<T>(maxReplaySize), strategy)
  }

  clear() {
    return this.sink.clear()
  }
}
