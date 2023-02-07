/**
 * A single reducer for a StatefulSubject.
 *
 * @group Subjects
 */
type StatefulSubjectReducer<Param, State> = Param extends void
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
