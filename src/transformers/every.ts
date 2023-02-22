import { Predicate } from '../utils/Function'

/**
 * Runs every chunk through a predicate. If anything fails the
 * predicate, `false` is queued and the stream terminated.
 * Otherwise this will wait for the entire stream to finish
 * before queuing `true`.
 *
 * @group Transformers
 * @example
 * When every chunk passes the predicate.
 * ```
 * --1--2--3--4--5--6--7--8--9-|
 *
 * every((x) => x < 10)
 *
 * -----------------------------true-|
 * ```
 *
 * When something fails the predicate.
 * ```
 * --1--2--3--4--5--6--X
 *
 * every((x) => x < 5)
 *
 * --------------------false-|
 * ```
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
