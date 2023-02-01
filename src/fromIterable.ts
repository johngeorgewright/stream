/**
 * Creates a readable stream from an iterable of values.
 *
 * @group Sources
 * @example
 * Using an iterable
 * ```
 * fromIterable([1, 2, 3, 4])
 * ```
 *
 * Using an Async Iterable
 * ```
 * fromIterable((async function* () {
 *   yield 1
 * })())
 * ```
 *
 * Using an ArrayLike
 * ```
 * fromIterable(document.querySelectorAll('div'))
 * ```
 */
export function fromIterable<T>(
  iterable: Iterable<T> | AsyncIterable<T> | ArrayLike<T>
) {
  return new ReadableStream<T>({
    async start(controller) {
      if (Symbol.iterator in iterable)
        for (const item of iterable) controller.enqueue(item)
      else if (Symbol.asyncIterator in iterable)
        for await (const item of iterable) controller.enqueue(item)
      else if ('length' in iterable)
        for (let i = 0; i < iterable.length; i++)
          controller.enqueue(iterable[i])
      controller.close()
    },
  })
}
