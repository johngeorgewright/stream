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
