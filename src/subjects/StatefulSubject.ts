import { ForkableRecallStream } from '../sinks/ForkableRecallStream'
import {
  stateReducer,
  StateReducerInput,
  StateReducerOutput,
  StateReducers,
} from '../transformers/stateReducer'
import { BaseSubject, BaseSubjectOptions } from './BaseSubject'

/**
 * The constructor options for a {@link StatefulSubject}.
 *
 * @group Subjects
 */
interface StatefulSubjectOptions<In, Out> extends BaseSubjectOptions<In, Out> {
  forkable?: ForkableRecallStream<Out>
  pipeThroughOptions?: StreamPipeOptions
}

/**
 * Another form of the {@link Subject:class} that reduces a piece
 * of state with actions and queues changes to the stream.
 *
 * It's important to note that if the result of an action does not change
 * the state then nothing is queued to the stream.
 *
 * @group Subjects
 * @see {@link stateReducer:function}
 * @example
 * ```
 * // The State will be the type of data you want to manipulate.
 * interface State {
 *   authors: string[]
 * }
 *
 * // The Actions are a record of "action name" to a parameter.
 * // If the action doesn't require a parameter, use `void`.
 * type Actions = {
 *   'add author': string
 *   'action that doesnt need a parameter': void
 * }
 *
 * // To get the best out of this API, pass the Actions type and State
 * // during construction.
 * const subject = new StatefulSubject<Actions, State>(
 *   {
 *     __INIT__: () => ({ authors: [] }),
 *
 *     'add author': (state, author) => state.authors.includes(author) ? state : {
 *        ...state,
 *        authors: [...state.authors, author],
 *     },
 *
 *     'action that doesnt need a parameter': (state) => state
 *   }
 * )
 *
 * subject.fork().pipeTo(write(console.info))
 * // { action: '__INIT__', state: { authors: [] } }
 *
 * subject.dispatch('add author', 'Jane Austin')
 * // { action: 'add author', param: 'Jane Austin', state: { authors: ['Jane Austin'] } }
 *
 * subject.dispatch('add author', 'Jane Austin')
 * // **Nothing will be queued as the state did not change.**
 * ```
 */
export class StatefulSubject<
  Actions extends Record<string, unknown>,
  State
> extends BaseSubject<
  StateReducerInput<Actions>,
  StateReducerOutput<Actions, State>
> {
  constructor(
    reducers: StateReducers<Actions, State>,
    {
      forkable = new ForkableRecallStream(),
      ...options
    }: StatefulSubjectOptions<
      StateReducerInput<Actions>,
      StateReducerOutput<Actions, State>
    > = {}
  ) {
    super({ forkable, controllable: options.controllable })
    this.controllable
      .pipeThrough(stateReducer(reducers), options.pipeThroughOptions)
      .pipeTo(this.forkable, options.pipeToOptions)
  }

  /**
   * Parameterised version of enqueue for simpliclity.
   *
   * @example
   * ```
   * subject.dispatch('action', 'param')
   * // Instead of
   * subject.enqueue({ action: 'action', param: 'param' })
   * ```
   */
  dispatch<Action extends keyof Actions>(
    ...args: Actions[Action] extends void
      ? [action: Action]
      : [action: Action, param: Actions[Action]]
  ) {
    this.controllable.enqueue({
      action: args[0],
      param: args[1],
    } as StateReducerInput<Actions>)
  }
}
