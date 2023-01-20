/**
 * Takes the first item from the stream and cancels it.
 */
export async function first<T>(
  readableStream: ReadableStream<T>
): Promise<T | undefined> {
  const reader = readableStream.getReader()
  const { done, value } = await reader.read()
  if (!done) reader.cancel()
  return value
}
