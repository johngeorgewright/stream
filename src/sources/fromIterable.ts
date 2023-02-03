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
  return new ReadableStream<T>(
    Symbol.iterator in iterable
      ? fromIterator(iterable[Symbol.iterator]())
      : Symbol.asyncIterator in iterable
      ? fromIterator(iterable[Symbol.asyncIterator]())
      : 'length' in iterable
      ? fromArrayLike(iterable)
      : {}
  )
}

function fromIterator<T>(
  iterator: Iterator<T> | AsyncIterator<T>
): UnderlyingDefaultSource<T> {
  return {
    async pull(controller) {
      let result: IteratorResult<T>

      try {
        result = await iterator.next()
      } catch (error) {
        return controller.error(error)
      }

      if (result.done) controller.close()
      else controller.enqueue(result.value)
    },
  }
}

function fromArrayLike<T>(arrayLike: ArrayLike<T>): UnderlyingDefaultSource<T> {
  let i = 0

  return {
    pull(controller) {
      if (i === arrayLike.length) controller.close()
      else controller.enqueue(arrayLike[i++])
    },
  }
}
