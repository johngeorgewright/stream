/**
 * Returns the chunk type of a ReadableStream.
 *
 * @group Utils
 * @example
 * ```
 * type T = ReadableStreamChunk<ReadableStream<number>>
 * // number
 * ```
 */
export type ReadableStreamChunk<R extends ReadableStream<unknown>> =
  R extends ReadableStream<infer T> ? T : never
