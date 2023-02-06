import { ForkableRecallStream } from '../sinks/ForkableRecallStream'
import { ControllableStream } from '../sources/ControllableStream'

/**
 * Another form of the {@link Subject:class} that reduces a piece
 * of state with actions and queues changes to the stream.
 *
 * It's important to note that if the result of an action does not change
 * the state then nothing is queued to the stream.
 *
 * @group Subjects
 * @see {@link Subject:class}
 * @see {@link StatefulSubjectBaseActions}
 * @see {@link StatefulSubjectReducers}
 * @example
 * ```
 * interface State {
 *   authors: string[]
 * }
 *
 * interface Actions extends StatefulSubjectBaseActions {
 *   'add author': string
 * }
 *
 * const subject = new StatefulSubject<Actions, State>(
 *   {
 *     __INIT__: () => ({ authors: [] }),
 *
 *     'add author': (author, state) => state.authors.includes(author) ? state : {
 *        ...state,
 *        authors: [...state.authors, author],
 *     },
 *   }
 * )
 *
 * subject.fork().pipeTo(write(console.info))
 * // { action: '__INIT__', state: { authors: [] } }
 *
 * subject.dispatch('add author', 'Jane Austin')
 * // { action: 'add author', state: { authors: ['Jane Austin'] } }
 *
 * subject.dispatch('add author', 'Jane Austin')
 * // **Nothing will be queued as the state did not change.**
 * ```
 */
export class StatefulSubject<
  Actions extends StatefulSubjectBaseActions,
  State
> {
  #controllable = new ControllableStream<{
    action: keyof Actions
    param: Actions[keyof Actions]
  }>()

  #forkable = new ForkableRecallStream<{
    action: keyof Actions
    state: State
  }>()

  #reducers: StatefulSubjectReducers<Actions, State>
  #state!: State

  constructor(reducers: StatefulSubjectReducers<Actions, State>) {
    this.#reducers = reducers
    this.#controllable.pipeThrough(this.#transform()).pipeTo(this.#forkable)
    this.dispatch('__INIT__', null)
  }

  dispatch<Action extends keyof Actions>(
    action: Action,
    param: Actions[Action]
  ) {
    this.#controllable.enqueue({ action, param })
  }

  close() {
    this.#controllable.close()
  }

  cancel(reason?: unknown) {
    return this.#controllable.cancel(reason)
  }

  fork() {
    return this.#forkable.fork()
  }

  #transform<Action extends keyof Actions>() {
    return new TransformStream<
      { action: Action; param: Actions[Action] },
      { action: Action; state: State }
    >({
      transform: (chunk, controller) => {
        const state = this.#reduce(chunk, this.#state)
        if (state !== this.#state) {
          this.#state = Object.freeze(state)
          controller.enqueue({ action: chunk.action, state })
        }
      },
    })
  }

  #reduce<Action extends keyof Actions>(
    {
      action,
      param,
    }: {
      action: Action
      param: Actions[Action]
    },
    state: State
  ) {
    return this.#reducers[action]?.(param, state) ?? state
  }
}

/**
 * The base interface for a StatefulSubject's actions.
 *
 * @group Subjects
 */
export interface StatefulSubjectBaseActions {
  /**
   * Called during initialization of a StatefulSubject
   */
  __INIT__: null
}

/**
 * A single reducer for a StatefulSubject.
 *
 * @group Subjects
 */
export interface StatefulSubjectReducer<Param, State> {
  (param: Param, state: Readonly<State>): Readonly<State>
}

/**
 * A collection of reducers for a StatefulSubject.
 *
 * @group Subjects
 */
export type StatefulSubjectReducers<
  Actions extends StatefulSubjectBaseActions,
  State
> = {
  [Action in keyof Actions]: StatefulSubjectReducer<Actions[Action], State>
}
