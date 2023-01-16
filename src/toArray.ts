/**
 * Consumes all chunks in the streams resolves them as an array.
 */
export async function toArray<T>(
  readableStream: ReadableStream<T>,
  streamPipeOptions?: StreamPipeOptions
) {
  const output: T[] = []
  await readableStream.pipeTo(
    new WritableStream({
      write(chunk) {
        output.push(chunk)
      },
    }),
    streamPipeOptions
  )
  return output
}
