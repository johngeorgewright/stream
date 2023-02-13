/**
 * A common interface for forkable streams.
 *
 * @group Sinks
 */
export interface Forkable<T> {
  fork(): ReadableStream<T>
}
