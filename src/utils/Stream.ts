import { L } from 'ts-toolbelt'

/**
 * Returns the chunk type of a ReadableStream.
 *
 * @group Utils
 * @category Stream
 * @example
 * ```
 * type T = ReadableStreamChunk<ReadableStream<number>>
 * // number
 * ```
 */
export type ReadableStreamChunk<R extends ReadableStream<unknown>> =
  R extends ReadableStream<infer T> ? T : never

/**
 * Creates a tuple type of the chunk types from a list of
 * ReadableStreams.
 *
 * @group Utils
 * @category Stream
 * @example
 * ```
 * type T = ReadableStreamsChunks<[
 *   ReadableStream<number>,
 *   ReadableStream<string>,
 *   ReadableStream<string>,
 *   ReadableStream<number>,
 * ]>
 * // [number, string, string, number]
 * ```
 */
export type ReadableStreamsChunks<Rs extends ReadableStream<unknown>[]> =
  _ReadableStreamsChunks<Rs, []>

type _ReadableStreamsChunks<
  Rs extends ReadableStream<unknown>[],
  Acc extends unknown[]
> = L.Length<Rs> extends 0
  ? Acc
  : _ReadableStreamsChunks<
      L.Tail<Rs>,
      [...Acc, ReadableStreamChunk<L.Head<Rs>>]
    >
