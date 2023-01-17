import { consume } from './consume'

/**
 * Consumes all chunks in the streams resolves them as an array.
 */
export async function toArray<T>(
  readableStream: ReadableStream<T>,
  streamPipeOptions?: StreamPipeOptions
) {
  const output: T[] = []
  await consume(
    readableStream,
    (chunk) => output.push(chunk),
    streamPipeOptions
  )
  return output
}
