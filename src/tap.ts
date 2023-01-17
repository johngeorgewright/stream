export function tap<T>(fn: (chunk: T) => any) {
  return new TransformStream<T, T>({
    transform(chunk, controller) {
      fn(chunk)
      controller.enqueue(chunk)
    },
  })
}
