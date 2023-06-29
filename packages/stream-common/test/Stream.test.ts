import {
  ReadableStreamChunk,
  ReadableStreamsChunk,
  ReadableStreamsChunks,
} from '@johngw/stream-common/Stream'
import { check, checks, Fail, Pass } from '@johngw/stream-common/Test'

test('ReadableStreamChunk', () => {
  checks([
    check<ReadableStreamChunk<ReadableStream<number>>, number, Pass>(),

    check<ReadableStreamChunk<ReadableStream<null>>, null, Pass>(),

    check<ReadableStreamChunk<ReadableStream<{ foo: string }>>, null, Fail>(),
  ])
})

test('ReadableStreamsChunk', () => {
  checks([
    check<
      ReadableStreamsChunk<[ReadableStream<string>, ReadableStream<number>]>,
      string | number,
      Pass
    >(),
  ])
})

test('ReadableStreamsChunks', () => {
  checks([
    check<
      ReadableStreamsChunks<
        [
          ReadableStream<number>,
          ReadableStream<string>,
          ReadableStream<string>,
          ReadableStream<number>
        ]
      >,
      [number, string, string, number],
      Pass
    >(),

    check<ReadableStreamsChunks<[]>, [], Pass>(),
  ])
})
