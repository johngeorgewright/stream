import { toIterator } from './toIterator'

/**
 * Turns a `ReadableStream` in to an `AsyncIterable`.
 *
 * @group Sinks
 * @example
 * ```
 * for await (const chunk of toIterable(stream)) {
 *
 * }
 * ```
 */
export function toIterable<T>(stream: ReadableStream<T>): AsyncIterable<T> {
  return {
    [Symbol.asyncIterator]: () => toIterator(stream),
  }
}
