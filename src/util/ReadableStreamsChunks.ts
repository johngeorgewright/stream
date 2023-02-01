import { L } from 'ts-toolbelt'
import { ReadableStreamChunk } from './ReadableStreamChunk'

/**
 * Creates a tuple type of the chunk types from a list of
 * ReadableStreams.
 *
 * @group Utils
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
