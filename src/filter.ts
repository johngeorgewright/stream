/**
 * Filters out queued chunks based on a predicate.
 *
 * @example
 * readableStream.pipeThrough(filter(chunk => chunk % 2 === 0))
 */
export function filter<T>(predicate: (x: T) => boolean) {
  return new TransformStream<T, T>({
    transform(chunk, controller) {
      if (predicate(chunk)) controller.enqueue(chunk)
    },
  })
}
