/**
 * Continuously emits `Date` chunks until cancelled.
 *
 * @group Sources
 * @example
 * ```
 * interval(1_000)
 *
 * ------<Date>------<Date>------
 * ```
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
