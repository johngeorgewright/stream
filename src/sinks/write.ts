/**
 * Consume chunks from a ReadableStream. Syntactical sugar
 * for a simple WritableStream.
 *
 * @group Sinks
 * @example
 * ```
 * readableStream.pipeTo(write(console.info))
 * ```
 */
export function write<T>(fn?: (chunk: T) => any) {
  return new WritableStream<T>(
    fn && {
      async write(chunk) {
        await fn(chunk)
      },
    }
  )
}
