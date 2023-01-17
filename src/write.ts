export function write<T>(fn?: (chunk: T) => any) {
  return new WritableStream<T>(
    fn && {
      async write(chunk) {
        await fn(chunk)
      },
    }
  )
}
