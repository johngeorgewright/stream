/**
 * Groups chunks together as an array of the specified size.
 * When required to flush, it will queue anything left over.
 *
 * @group Transformers
 * @example
 * ```
 * --a----b------c------d------
 *
 * chunks(2)
 *
 * -------[a,b]---------[c,d]--
 * ```
 */
export function chunks<T>(length: number) {
  let chunk: T[] = []

  return new TransformStream<T, T[]>({
    transform(x, controller) {
      if (chunk.length === length) {
        controller.enqueue(chunk)
        chunk = []
      }
      chunk.push(x)
    },

    flush(controller) {
      if (chunk.length) controller.enqueue(chunk)
    },
  })
}
