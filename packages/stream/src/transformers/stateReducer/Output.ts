import { L, U } from 'ts-toolbelt'
import { StateReducerInit } from '#transformers/stateReducer/Reducers'

/**
 * Represents the Writable (output) types of StateReducer actions.
 *
 * @group Transformers
 * @example
 * ```
 * type T = StateReducerOutput<{ foo: string, bar: number, nothing: void }, string>
 * // | { action: 'foo', param: string, state: string }
 * // | { action: 'bar', param: number, state: string }
 * // | { action: 'nothing', state: string }
 * ```
 */
export type StateReducerOutput<
  Actions extends Record<string, unknown>,
  State
> = AccumulateStateReducerOutput<
  Actions,
  Readonly<State>,
  U.ListOf<keyof Actions>,
  { action: StateReducerInit; state: Readonly<State> }
>

/**
 * {@inheritdoc StateReducerOutput}
 */
type AccumulateStateReducerOutput<
  Actions extends Record<string, unknown>,
  State,
  ActionNames extends readonly (keyof Actions)[],
  Acc extends { action: keyof Actions; param?: unknown; state: State }
> = L.Length<ActionNames> extends 0
  ? Acc
  : AccumulateStateReducerOutput<
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
