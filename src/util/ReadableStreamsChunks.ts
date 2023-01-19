import { L } from 'ts-toolbelt'
import { ReadableStreamChunk } from './ReadableStreamChunk'

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
