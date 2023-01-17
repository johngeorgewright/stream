import { write } from './write'

export function consume<T>(
  stream: ReadableStream<T>,
  consume: (item: T) => any,
  streamPipeOptions?: StreamPipeOptions
) {
  return stream.pipeTo(write(consume), streamPipeOptions)
}
