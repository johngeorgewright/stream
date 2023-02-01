/**
 * @group Utils
 */
export interface Predicate<T> {
  (chunk: T): boolean | Promise<boolean>
}
