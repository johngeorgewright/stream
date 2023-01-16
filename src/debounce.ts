export function debounce<T>(ms: number) {
  let acc: T[] = []
  let timer: NodeJS.Timer

  return new TransformStream<T, T[]>({
    transform(chunk, controller) {
      acc.push(chunk)
      clearTimeout(timer)
      timer = setTimeout(() => {
        controller.enqueue(acc)
        acc = []
      }, ms)
    },

    flush(controller) {
      clearTimeout(timer)
      controller.enqueue(acc)
    },
  })
}
