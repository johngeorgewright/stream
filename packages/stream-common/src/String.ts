import { takeUntil, takeWhile } from './Iterable.js'

/**
 * Something that can be converted to a string.
 *
 * @group Utils
 * @category String
 */
export interface Stringable {
  toString(): string
}

/**
 * Extract part of a string until a predicate returns true.
 *
 * @group Utils
 * @category String
 */
export function takeCharsWhile(string: string, matchingString: string): string

export function takeCharsWhile(
  string: string,
  predicate: (x: string) => boolean
): string

export function takeCharsWhile(
  string: string,
  predicate: string | ((x: string) => boolean)
) {
  let result = ''
  for (const char of takeWhile(
    string,
    typeof predicate === 'string' ? (x) => x === predicate : predicate
  ))
    result += char
  return result
}

/**
 * Extract part of a string until a predicate returns true.
 *
 * @group Utils
 * @category String
 */
export function takeCharsUntil(string: string, matchingString: string): string

export function takeCharsUntil(
  string: string,
  predicate: (x: string) => boolean
): string

export function takeCharsUntil(
  string: string,
  predicate: string | ((x: string) => boolean)
) {
  let result = ''
  for (const char of takeUntil(
    string,
    typeof predicate === 'string' ? (x) => x === predicate : predicate
  ))
    result += char
  return result
}
