/**
 * Subscribe to chunks in the stream.
 *
 * @example
 * readableStream.pipeThrough(tap(chunk => console.info(x)))
 */
export function tap<T>(fn: (chunk: T) => any) {
  return new TransformStream<T, T>({
    transform(chunk, controller) {
      fn(chunk)
      controller.enqueue(chunk)
    },
  })
}
