/**
 * Makes sure that events are emitted within `ms`.
 * Otherwise emits an error.
 *
 * @example
 * open(readableStream.pipeThrough(timeout(1_000)))
 *   .catch(error => {
 *     // error is TimeoutError if any event took too long
 *   })
 */
export function timeout<T>(ms: number) {
  let timer: NodeJS.Timer

  return new TransformStream<T, T>({
    start: begin,

    transform(chunk, controller) {
      begin(controller)
      controller.enqueue(chunk)
    },

    flush() {
      clearTimeout(timer)
    },
  })

  function begin(controller: TransformStreamDefaultController<T>) {
    clearTimeout(timer)
    timer = setTimeout(() => controller.error(new TimeoutError(ms)))
  }
}

export class TimeoutError extends Error {
  constructor(public readonly ms: number) {
    super(`Exceeded ${ms}ms`)
  }
}
