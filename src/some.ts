import { Predicate } from './util/Preciate'

/**
 * Runs every chunk through a predicate. If anything suceeds the
 * predicate, `true` is queued and the stream terminated.
 * Otherwise this will wait for the entire stream to finish
 * before queuing `false`.
 */
export function some<T>(predicate: Predicate<T>) {
  return new TransformStream<T, boolean>({
    async transform(chunk, controller) {
      if (await predicate(chunk)) {
        controller.enqueue(true)
        controller.terminate()
      }
    },

    flush(controller) {
      controller.enqueue(false)
    },
  })
}
