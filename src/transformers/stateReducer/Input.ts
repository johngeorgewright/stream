import { L, U } from 'ts-toolbelt'
import { StateReducerInit } from './Reducers'

/**
 * Represents the Readable (input) types of StateReducer actions.
 *
 * @group Transformers
 * @example
 * ```
 * type T = StateReducerInput<{ foo: string, bar: number, nothing: void }>
 * // | { action: 'foo', param: string }
 * // | { action: 'bar', param: number }
 * // | { action: 'nothing' }
 * ```
 */
export type StateReducerInput<Actions extends Record<string, unknown>> =
  AccumulateStateReducerInput<
    Actions,
    U.ListOf<keyof Actions>,
    { action: StateReducerInit }
  >

/**
 * {@inheritdoc StateReducerInput}
 */
type AccumulateStateReducerInput<
  Actions extends Record<string, unknown>,
  ActionNames extends readonly (keyof Actions)[],
  Acc extends { action: keyof Actions; param?: unknown }
> = L.Length<ActionNames> extends 0
  ? Acc
  : AccumulateStateReducerInput<
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
