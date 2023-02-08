import { L, U } from 'ts-toolbelt'

/**
 * Represents the Writable (output) types of StatefulSubject actions.
 *
 * @group Subjects
 * @example
 * ```
 * type T = StatefulSubjectOutput<{ foo: string, bar: number, nothing: void }, string>
 * // | { action: 'foo', param: string, state: string }
 * // | { action: 'bar', param: number, state: string }
 * // | { action: 'nothing', state: string }
 * ```
 */
export type StatefuleSubjectOutput<
  Actions extends Record<string, unknown>,
  State
> = _StatefulSubjectOutput<
  Actions,
  Readonly<State>,
  U.ListOf<keyof Actions>,
  { action: '__INIT__'; state: Readonly<State> }
>

/**
 * {@inheritdoc StatefuleSubjectOutput}
 * @hidden
 */
type _StatefulSubjectOutput<
  Actions extends Record<string, unknown>,
  State,
  ActionNames extends readonly (keyof Actions)[],
  Acc extends { action: keyof Actions; param?: unknown; state: State }
> = L.Length<ActionNames> extends 0
  ? Acc
  : _StatefulSubjectOutput<
      Actions,
      State,
      L.Tail<ActionNames>,
      | Acc
      | (Actions[L.Head<ActionNames>] extends void
          ? { action: L.Head<ActionNames>; state: State }
          : {
              action: L.Head<ActionNames>
              param: Actions[L.Head<ActionNames>]
              state: State
            })
    >
