/**
 * Call the predicate on each chunk in the queue.
 * The first chunk to pass the predicate will be queued
 * and the stream will be terminated.
 */
export function find<T>(predicate: (chunk: T) => boolean) {
  return new TransformStream<T>({
    transform(chunk, controller) {
      if (predicate(chunk)) {
        controller.enqueue(chunk)
        controller.terminate()
      }
    },
  })
}
