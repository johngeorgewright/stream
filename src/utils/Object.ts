import { pop, last } from './Array.js'

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
 * Gets a value in `obj` using `path`. Returns undefined
 * if the keys don't exist.
 *
 * @example
 * ```
 * get({ foo: { bar: 'foobar' } }, ['foo', 'bar'])
 * // 'foobar'
 *
 * get({ a: { b: 'c' } }, ['foo', 'bar'])
 * // undefined
 * ```
 */
export function get(obj: Record<string, unknown>, path: string[]) {
  let value: unknown = obj
  for (const key of path) {
    if (isNonNullObject(value) && key in value) value = value[key]
    else return undefined
  }
  return value
}

/**
 * Deletes a value in `obj` using `path`.
 *
 * @example
 * ```
 * unset({ foo: { bar: 'foobar' } }, ['foo', 'bar'])
 * // { foo: {} }
 *
 * unset({ a: { b: 'c' } }, ['foo', 'bar'])
 * // { a: { b: 'c' } }
 * ```
 */
export function unset<T extends Record<string, unknown>>(
  obj: T,
  path: string[]
) {
  const key = last(path)
  const value = get(obj, pop(path))
  if (key && isNonNullObject(value) && key in value) delete value[key]
  return obj
}

/**
 * Sets a value in `obj` using `path`.
 *
 * @example
 * set({ foo: { bar: 'foobar' } }, ['foo', 'bar'], 'barfoo')
 * // { foo: { bar: 'barfoo' } }
 *
 * set({ a: { b: 'c' } }, ['foo', 'bar'], 'foobar')
 * // { a: { b: 'c' }, foo: { bar: 'foobar' } }
 */
export function set<T extends Record<string, unknown>>(
  obj: T,
  path: string[],
  value: unknown
) {
  const key = last(path)
  if (!key) return obj
  let current = obj
  for (const key of pop(path)) {
    if (!(key in current)) Object.assign(current, { [key]: {} })
    else if (!isNonNullObject(current[key]))
      throw new Error(
        `Cannot override "${key}" as it's not an object in:\n${JSON.stringify(
          current
        )}`
      )
    current = current[key] as T
  }
  Object.assign(current, { [key]: value })
  return obj
}

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
