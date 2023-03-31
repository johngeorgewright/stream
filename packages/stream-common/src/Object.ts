/**
 * Pick object properties where the value is of a type.
 *
 * @group Utils
 * @category Object
 */
export type PickByValue<T, ValueType> = Pick<
  T,
  { [Key in keyof T]-?: T[Key] extends ValueType ? Key : never }[keyof T]
>

/**
 * Returns true if `x` is an object and not `null`.
 *
 * @group Utils
 * @category Object
 */
export function isNonNullObject(x: unknown): x is Record<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  keyof any,
  unknown
> {
  return typeof x === 'object' && x !== null
}

/**
 * Returns true if `x` is `ArrayLike`.
 *
 * @group Utils
 * @category Array
 */
export function isArrayLike<T>(x: unknown): x is ArrayLike<T> {
  return isNonNullObject(x) && 'length' in x
}

/**
 * @group Utils
 * @category Array
 */
export function isIterable<T>(x: unknown): x is Iterable<T> {
  return isNonNullObject(x) && Symbol.iterator in x
}

/**
 * @group Utils
 * @category Array
 */
export function isAsyncIterable<T>(x: unknown): x is AsyncIterable<T> {
  return isNonNullObject(x) && Symbol.asyncIterator in x
}

/**
 * @group Utils
 * @category Array
 */
export function isIteratorOrAsyncIterator<T>(
  x: unknown
): x is Iterator<T> | AsyncIterator<T> {
  return isNonNullObject(x) && 'next' in x
}
