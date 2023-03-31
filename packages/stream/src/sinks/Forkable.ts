/**
 * A common interface for forkable streams.
 *
 * @group Sinks
 */
export interface Forkable<T> {
  fork(
    underlyingSource?: UnderlyingDefaultSource<T>,
    queuingStrategy?: QueuingStrategy<T>
  ): ReadableStream<T>
}
