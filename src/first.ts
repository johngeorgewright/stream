export async function first<T>(readableStream: ReadableStream<T>): Promise<T> {
  const reader = readableStream.getReader()
  const { value } = await reader.read()
  reader.cancel()
  return value as T
}
