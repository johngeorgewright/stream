export function first<T>() {
  return new TransformStream<T, T>({
    transform(chunk, controller) {
      controller.enqueue(chunk)
      controller.terminate()
    },
  })
}
