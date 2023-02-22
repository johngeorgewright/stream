/**
 * Do nothing. Simply pass chunks through.
 *
 * @group Transformers
 * @example
 * ```
 * --a--b--c--d--e--f--
 *
 * identity()
 *
 * --a--b--c--d--e--f--
 * ```
 */
export function identity<T>() {
  return new TransformStream<T, T>()
}
