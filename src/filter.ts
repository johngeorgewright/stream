import { Predicate } from './util/Preciate'

/**
 * Filters out queued chunks based on a predicate.
 *
 * @group Transformers
 * @example
 * ```
 * --1--2--3--4--5--6--7--8--9--
 *
 * filter((x) => x % 2 === 0)
 *
 * -----2-----4-----6-----8-----
 * ```
 */
export function filter<T>(predicate: Predicate<T>) {
  return new TransformStream<T, T>({
    async transform(chunk, controller) {
      if (await predicate(chunk)) controller.enqueue(chunk)
    },
  })
}
