import { L, U } from 'ts-toolbelt'

/**
 * A single reducer for a StatefulSubject.
 *
 * @group Subjects
 */
export type StatefulSubjectReducer<Param, State> = Param extends void
  ? (state: Readonly<State>) => Readonly<State>
  : (state: Readonly<State>, param: Param) => Readonly<State>

/**
 * A collection of reducers for a StatefulSubject.
 *
 * @group Subjects
 */
export type StatefulSubjectReducers<
  Actions extends Record<string, unknown>,
  State
> = {
  [Action in keyof Actions]: StatefulSubjectReducer<Actions[Action], State>
} & { __INIT__(): Readonly<State> }

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
