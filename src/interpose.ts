export function interpose<T>(fn: (chunk: T) => Promise<void>) {
  return new TransformStream<T, T>({
    async transform(chunk, controller) {
      try {
        await fn(chunk)
      } catch (error) {
        return controller.error(error)
      }
      controller.enqueue(chunk)
    },
  })
}
