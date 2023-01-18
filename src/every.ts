/**
 * Runs every chunk through a predicate. If anything fails the
 * predicate, `false` is queued and the stream terminated.
 * Otherwise this will wait for the entire stream to finish
 * before queuing `true`.
 */
export function every<T>(predicate: (chunk: T) => boolean) {
  return new TransformStream<T, boolean>({
    transform(chunk, controller) {
      if (!predicate(chunk)) {
        controller.enqueue(false)
        controller.terminate()
      }
    },

    flush(controller) {
      controller.enqueue(true)
    },
  })
}
