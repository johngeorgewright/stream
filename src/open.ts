/**
 * Begins reading from the stream
 */
export async function open<T>(
  readableStream: ReadableStream<T>,
  streamPipeOptions?: StreamPipeOptions
) {
  return readableStream.pipeTo(new WritableStream(), streamPipeOptions)
}
