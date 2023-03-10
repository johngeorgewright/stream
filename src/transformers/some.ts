import { Predicate } from '../utils/Function'

/**
 * Runs every chunk through a predicate. If anything suceeds the
 * predicate, `true` is queued and the stream terminated.
 * Otherwise this will wait for the entire stream to finish
 * before queuing `false`.
 *
 * @group Transformers
 * @see {@link every:function}
 * @example
 * When every chunk failes the predicate.
 * ```
 * --1--2--3--4--5--6--7--8--9-|
 *
 * every((x) => x > 10)
 *
 * -----------------------------false-|
 * ```
 *
 * When something passes the predicate.
 * ```
 * --1--2--3--4--5--6--X
 *
 * every((x) => x > 5)
 *
 * --------------------true-|
 * ```
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
