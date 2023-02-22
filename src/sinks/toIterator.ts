/**
 * Turns a `ReadableStream` in to an `AsyncIterator`.
 *
 * @group Sinks
 * @example
 * ```
 * const iterator = toIterator(stream)
 * while (true) {
 *   const result = await iterator.next()
 *   if (result.done) break
 *   doSomething(result.value)
 * }
 * ```
 */
export function toIterator<T>(stream: ReadableStream<T>): AsyncIterator<T> {
  const reader = stream.getReader()
  return {
    next: () => reader.read() as Promise<IteratorResult<T>>,
  }
}
