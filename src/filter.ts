import { Predicate } from './util/Preciate'

/**
 * Filters out queued chunks based on a predicate.
 *
 * @example
 * readableStream.pipeThrough(filter(chunk => chunk % 2 === 0))
 */
export function filter<T>(predicate: Predicate<T>) {
  return new TransformStream<T, T>({
    async transform(chunk, controller) {
      if (await predicate(chunk)) controller.enqueue(chunk)
    },
  })
}
