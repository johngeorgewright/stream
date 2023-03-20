import { L } from 'ts-toolbelt'
import { write } from '../index.js'

/**
 * Something that can be flushed by another stream.
 *
 * @group Utils
 * @category Stream
 */
export interface Flushable {
  flushes?: ReadableStream<unknown>
  /**
   * By default an error in the `flushes` stream will be sent by the transformer.
   */
  ignoreFlushErrors?: boolean
}

/**
 * Using a {@link Flushable} notify when the stream
 * flushes and errors.
 *
 * @group Utils
 * @category Stream
 */
export function pipeFlushes(
  onFlush: () => unknown,
  onError: (error: unknown) => unknown,
  options?: Flushable
) {
  options?.flushes?.pipeTo(write(onFlush)).catch(
    options.ignoreFlushErrors
      ? () => {
          // Ignored
        }
      : onError
  )
}

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
 * Returns the union chunk type of a list of ReadableStreams.
 *
 * @group Utils
 * @category Stream
 * @example
 * ```
 * type T = ReadableStreamsChunk<[ReadableStream<number>, ReadableStream<string>]>
 * // number | string
 * ```
 */
export type ReadableStreamsChunk<RSs extends ReadableStream<unknown>[]> =
  RSs extends ReadableStream<infer T>[] ? T : never

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
