/**
 * A collection of reducers for a StatefulSubject.
 *
 * @group Subjects
 * @example
 * ```
 * interface State {
 *   foos: string[]
 * }
 *
 * interface Actions {
 *   foo: string
 * }
 *
 * type Reducers = StatefulSubjectReducers<State, Actions>
 * // {
 * //   __INIT__: () => State,
 * //   foo: (state: State, param: string) => State,
 * // }
 * ```
 */
export type StatefulSubjectReducers<Actions, State> = {
  [Action in keyof Actions]: StatefulSubjectReducer<Actions[Action], State>
} & { __INIT__(): Readonly<State> }

/**
 * A single reducer for a StatefulSubject.
 *
 * @group Subjects
 * @example
 * ```
 * interface State {
 *   foos: string[]
 * }
 *
 * type Reducer1 = StatefulSubjectReducer<string, Actions>
 * // (state: State, param: string) => State
 *
 * type Reducer2 = StatefulSubjectReducer<void, Actions>
 * // (state: State) => State
 * ```
 */
export type StatefulSubjectReducer<Param, State> = Param extends void
  ? (state: Readonly<State>) => Readonly<State>
  : (state: Readonly<State>, param: Param) => Readonly<State>
