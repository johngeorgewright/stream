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
