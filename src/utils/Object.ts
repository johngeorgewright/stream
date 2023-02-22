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
