/**
 * Continuously emits `Date` chunks until cancelled.
 */
export function interval(ms: number) {
  let timer: NodeJS.Timer

  return new ReadableStream<Date>({
    start(controller) {
      timer = setInterval(() => controller.enqueue(new Date()), ms)
    },

    cancel() {
      clearInterval(timer)
    },
  })
}
