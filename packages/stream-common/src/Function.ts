/**
 * @group Utils
 * @category Function
 */
export interface Accumulator<I, O> {
  (accumulation: O, chunk: I): O | Promise<O>
}

/**
 * @group Utils
 * @category Function
 */
export interface Predicate<T> {
  (chunk: T): boolean | Promise<boolean>
}

/**
 * Use for declaring static interfaces.
 *
 * @group Utils
 * @category Function
 * @example
 * ```
 * interface Comparable<T> {
 *   compare(a: T): number;
 * }
 *
 * interface ComparableStatic<T> extends Type<Comparable<T>> {
 *   compare(a: T, b: T): number;
 * }
 *
 * @staticImplements<ComparableStatic<TableCell>>()
 * class TableCell {
 *   value: number;
 *
 *   compare(a: TableCell): number {
 *     return this.value - a.value;
 *   }
 *
 *   static compare(a: TableCell, b: TableCell): number {
 *     return a.value - b.value;
 *   }
 * }
 * ```
 */
export interface StaticType<T> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  new (...args: any[]): T
}

/**
 * Use for declaring static types on a class.
 *
 * @group Utils
 * @category Function
 * @example
 * ```
 * interface Comparable<T> {
 *   compare(a: T): number;
 * }
 *
 * interface ComparableStatic<T> extends Type<Comparable<T>> {
 *   compare(a: T, b: T): number;
 * }
 *
 * @staticImplements<ComparableStatic<TableCell>>()
 * class TableCell {
 *   value: number;
 *
 *   compare(a: TableCell): number {
 *     return this.value - a.value;
 *   }
 *
 *   static compare(a: TableCell, b: TableCell): number {
 *     return a.value - b.value;
 *   }
 * }
 */
export function staticImplements<T>() {
  return (_constructor: T, _context: unknown) => {
    //
  }
}
