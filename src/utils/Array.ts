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
 * Returns the last item of an array.
 *
 * @group Utils
 * @category Array
 */
export function last<T>(array: T[]): T | undefined {
  return array[array.length - 1]
}

/**
 * Returns a copy of `array` without the last item.
 *
 * @group Utils
 * @category Array
 */
export function pop<T>(array: T[]): T[] {
  return array.slice(0, -1)
}
