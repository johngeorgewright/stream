export function consume<T>(
  stream: ReadableStream<T>,
  consume: (item: T) => any,
  streamPipeOptions?: StreamPipeOptions
) {
  return stream.pipeTo(
    new WritableStream({
      write(item) {
        consume(item)
      },
    }),
    streamPipeOptions
  )
}
