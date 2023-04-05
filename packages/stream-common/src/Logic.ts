import { Stringable } from './String.js'

/**
 * Looks up a value from
 *
 * @group Utils
 * @category Logic
 * @example
 * ```
 * const choices = {
 *   1: 'one',
 *   2: 'two',
 *   3: 'three',
 *   _: 'default',
 * }
 *
 * expect(when(choices, 1)).toBe('one')
 * expect(when(choices, 2)).toBe('two')
 * expect(when(choices, 3)).toBe('three')
 * expect(when(choices, 4)).toBe('default')
 * ```
 *
 * This function is curried.
 *
 * ```
 * const number = when({
 *   1: 'one',
 *   2: 'two',
 *   3: 'three',
 *   _: 'default',
 * })
 *
 * expect(number(1)).toBe('one')
 * expect(number(2)).toBe('two')
 * expect(number(3)).toBe('three')
 * expect(number(4)).toBe('default')
 * ```
 */
export function when<T extends string | number>(
  choices: Record<T, Stringable> & { _: Stringable }
): (key: string | number) => Stringable

export function when<T extends string | number>(
  choices: Record<T, Stringable> & { _: Stringable },
  key: string | number
): Stringable

export function when<T extends string | number>(
  choices: Record<T, Stringable> & { _: Stringable },
  key?: string | number
): Stringable | ((key: string | number) => Stringable) {
  return key === undefined
    ? (key: string | number) => when(choices, key)
    : key in choices
    ? choices[key as T]
    : choices._
}
