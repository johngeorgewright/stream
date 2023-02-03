/**
 * Puts the current value and previous value together as an array, and queues that.
 *
 * @group Transformers
 * @example
 * ```
 * --a----b------c------d------
 *
 * pairwise()
 *
 * -------[a,b]--[b,c]--[c,d]--
 * ```
 */
export function pairwise<T>() {
  let previous: T | undefined

  return new TransformStream<T, [T, T]>({
    transform(chunk, controller) {
      if (previous) controller.enqueue([previous, chunk])
      previous = chunk
    },
  })
}
