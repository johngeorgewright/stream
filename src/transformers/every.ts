import { Predicate } from '../utils/Function.js'
import { Flushable, pipeFlushes } from '../utils/Stream.js'

/**
 * Runs every chunk through a predicate. If anything fails the
 * predicate, `false` is queued and the stream terminated.
 * Otherwise this will wait for the entire stream to finish
 * before queuing `true`.
 *
 * @group Transformers
 * @see {@link some:function}
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
export function every<T>(predicate: Predicate<T>, options?: Flushable) {
  const finishController = new AbortController()

  return new TransformStream<T, boolean>({
    start(controller) {
      pipeFlushes(
        () => controller.enqueue(true),
        (error) => controller.error(error),
        { ...options, signal: finishController.signal }
      )
    },

    async transform(chunk, controller) {
      try {
        if (!(await predicate(chunk))) {
          controller.enqueue(false)
          controller.terminate()
        }
      } catch (error) {
        controller.error(error)
      }
    },

    flush(controller) {
      controller.enqueue(true)
      finishController.abort()
    },
  })
}
