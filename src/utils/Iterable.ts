export function* takeUntil<T>(
  iterable: Iterable<T>,
  predicate: (x: T) => boolean
) {
  for (const x of iterable) {
    if (predicate(x)) return
    yield x
  }
}

export function takeWhile<T>(
  iterable: Iterable<T>,
  predicate: (x: T) => boolean
) {
  return takeUntil(iterable, (x) => !predicate(x))
}
