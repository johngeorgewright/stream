/**
 * Runs every chunk through a predicate. If anything suceeds the
 * predicate, `true` is queued and the stream terminated.
 * Otherwise this will wait for the entire stream to finish
 * before queuing `false`.
 */
export function every<T>(predicate: (chunk: T) => boolean) {
  return new TransformStream<T, boolean>({
    transform(chunk, controller) {
      if (predicate(chunk)) {
        controller.enqueue(true)
        controller.terminate()
      }
    },

    flush(controller) {
      controller.enqueue(false)
    },
  })
}
