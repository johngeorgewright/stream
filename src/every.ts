import { Predicate } from './util/Preciate'

/**
 * Runs every chunk through a predicate. If anything fails the
 * predicate, `false` is queued and the stream terminated.
 * Otherwise this will wait for the entire stream to finish
 * before queuing `true`.
 */
export function every<T>(predicate: Predicate<T>) {
  return new TransformStream<T, boolean>({
    async transform(chunk, controller) {
      if (!(await predicate(chunk))) {
        controller.enqueue(false)
        controller.terminate()
      }
    },

    flush(controller) {
      controller.enqueue(true)
    },
  })
}
