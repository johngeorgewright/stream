export function debounce<T>(ms: number) {
  let timer: NodeJS.Timer

  return new TransformStream<T, T>({
    transform(chunk, controller) {
      clearTimeout(timer)
      timer = setTimeout(() => controller.enqueue(chunk), ms)
    },

    flush() {
      clearTimeout(timer)
    },
  })
}
