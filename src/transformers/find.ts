import { Predicate } from '../util/Preciate'

/**
 * Call the predicate on each chunk in the queue.
 * The first chunk to pass the predicate will be queued
 * and the stream will be terminated.
 *
 * @group Transformers
 * @example
 * ```
 * --1--2--3--4--5--6-X
 *
 * find((x) => x === 6)
 *
 * -----------------6-|
 * ```
 */
export function find<T>(predicate: Predicate<T>) {
  return new TransformStream<T>({
    async transform(chunk, controller) {
      if (await predicate(chunk)) {
        controller.enqueue(chunk)
        controller.terminate()
      }
    },
  })
}
