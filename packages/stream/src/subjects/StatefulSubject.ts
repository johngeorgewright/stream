import { without } from '@johngw/stream-common'
import { ForkableRecallStream } from '../sinks/ForkableRecallStream.js'
import {
  stateReducer,
  StateReducerInput,
  StateReducerOutput,
  StateReducers,
} from '../transformers/stateReducer/index.js'
import { BaseSubject, BaseSubjectOptions } from './BaseSubject.js'
import { StatefulSubjectController } from './StatefulSubjectController.js'

/**
 * The constructor options for a {@link StatefulSubject}.
 *
 * @group Subjects
 */
interface StatefulSubjectOptions<Actions extends Record<string, unknown>, State>
  extends BaseSubjectOptions<
    StateReducerInput<Actions>,
    StateReducerOutput<Actions, State>
  > {
  forkable?: ForkableRecallStream<StateReducerOutput<Actions, State>>
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
    }: StatefulSubjectOptions<Actions, State> = {}
  ) {
    super({ ...options, forkable })
    this.controllable
      .pipeThrough(stateReducer(reducers), options.pipeThroughOptions)
      .pipeTo(this.forkable, options.pipeToOptions)
      .catch(() => {
        // Errors can be handled in forks
      })
  }

  /**
   * Returns a new {@link StatefulControllableStream}. Once all controllers
   * have been closed, then the source is also closed.
   */
  override control(): StatefulSubjectController<Actions> {
    const controller = new StatefulSubjectController(this.controllable, () => {
      this.controllers = without(this.controllers, controller)
      if (!this.controllers.length) this.controllable.close()
    })
    this.controllers.push(controller)
    return controller
  }
}
