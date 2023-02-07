import { L, U } from 'ts-toolbelt'

/**
 * Represents the Readable (input) types of StatefulSubject actions.
 *
 * @group Subjects
 * @example
 * ```
 * type T = StatefulSubjectInput<{ foo: string, bar: number, nothing: void }>
 * // | { action: 'foo', param: string }
 * // | { action: 'bar', param: number }
 * // | { action: 'nothing' }
 * ```
 */
export type StatefulSubjectInput<Actions extends Record<string, unknown>> =
  _StatefulSubjectInput<
    Actions,
    U.ListOf<keyof Actions>,
    { action: '__INIT__' }
  >

type _StatefulSubjectInput<
  Actions extends Record<string, unknown>,
  ActionNames extends readonly (keyof Actions)[],
  Acc extends { action: keyof Actions; param?: unknown }
> = L.Length<ActionNames> extends 0
  ? Acc
  : _StatefulSubjectInput<
      Actions,
      L.Tail<ActionNames>,
      | Acc
      | (Actions[L.Head<ActionNames>] extends void
          ? { action: L.Head<ActionNames> }
          : {
              action: L.Head<ActionNames>
              param: Actions[L.Head<ActionNames>]
            })
    >
