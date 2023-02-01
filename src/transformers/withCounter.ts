import { map } from './map'

/**
 * Adds a counter representing the amount of chunks
 * received thus far.
 *
 * @group Transformer
 * @example
 * ```
 * --a----------------------b-------|
 *
 * withCounter()
 *
 * --{chunk:'a',counter:0}--{chunk:'b',counter:1}-|
 * ```
 */
export function withCounter<T>(start = 0) {
  let counter = start
  return map<T, { chunk: T; counter: number }>((chunk) => ({
    chunk,
    counter: counter++,
  }))
}
