/**
 * Take from an iterable until the `predicate` returns true.
 *
 * @group Utils
 * @category Iterable
 */
export function* takeUntil<T>(
  iterable: Iterable<T>,
  predicate: (x: T) => boolean
) {
  for (const x of iterable) {
    if (predicate(x)) return
    yield x
  }
}

/**
 * Take from an iterable while a `predicate` returns true.
 *
 * @group Utils
 * @category Iterable
 */
export function takeWhile<T>(
  iterable: Iterable<T>,
  predicate: (x: T) => boolean
) {
  return takeUntil(iterable, (x) => !predicate(x))
}

/**
 * Consumes an async iterable in to an array.
 *
 * @group Utils
 * @category Iterable
 */
export async function asyncIterableToArray<T>(iterable: AsyncIterable<T>) {
  const array: T[] = []
  for await (const item of iterable) array.push(item)
  return array
}
