export function debounce<T>(
  ms: number,
  { leading, trailing }: DebounceOptions = { trailing: true }
) {
  let timer: NodeJS.Timer | void

  return new TransformStream<T, T>({
    transform(chunk, controller) {
      const queueLeading = !timer && leading
      if (queueLeading) controller.enqueue(chunk)
      if (timer) timer = clearTimeout(timer)
      timer = setTimeout(() => {
        timer = clearTimeout(timer!)
        !queueLeading && trailing && controller.enqueue(chunk)
      }, ms)
    },

    flush() {
      if (timer) clearTimeout(timer)
    },
  })
}

export interface DebounceOptions {
  leading?: boolean
  trailing?: boolean
}
