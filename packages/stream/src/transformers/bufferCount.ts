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
export function bufferCount<T>(length: number) {
  let buffer: T[] = []

  return new TransformStream<T, T[]>({
    transform(chunk, controller) {
      if (buffer.length === length) {
        controller.enqueue(buffer)
        buffer = []
      }
      buffer.push(chunk)
    },

    flush(controller) {
      if (buffer.length) controller.enqueue(buffer)
    },
  })
}
