/**
 * Removes the first occurance of `item` in `array`.
 *
 * @group Utils
 * @category Array
 * @exampe
 * ```
 * without([1, 2, 3, 4, 5], 4)
 * // [1, 2, 3, 5]
 * ```
 */
export function without<T>(array: T[], item: T): T[] {
  const index = array.indexOf(item)
  return index === -1
    ? array
    : [...array.slice(0, index), ...array.slice(index + 1)]
}

/**
 * Much like Array.prototype.find() however it results
 * the result of the callback.
 *
 * @group Utils
 * @category Array
 * @example
 * ```
 * console.info(
 *   search(['', '1'], (x) => x && Number(x))
 * )
 * ```
 */
export function search<T, R>(
  array: T[],
  search: (item: T) => R | undefined
): R | undefined {
  let result: R | undefined

  for (const item of array) {
    result = search(item)
    if (result !== undefined) break
  }

  return result
}
