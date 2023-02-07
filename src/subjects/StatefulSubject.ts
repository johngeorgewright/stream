import { L, O, U } from 'ts-toolbelt'
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
 * @see {@link StatefulSubjectReducers}
 * @example
 * ```
 * interface State {
 *   authors: string[]
 * }
 *
 * type Actions = {
 *   'add author': string
 * }
 *
 * const subject = new StatefulSubject<Actions, State>(
 *   {
 *     __INIT__: () => ({ authors: [] }),
 *
 *     'add author': (state, author) => state.authors.includes(author) ? state : {
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
export class StatefulSubject<Actions extends Record<string, unknown>, State> {
  #controllable = new ControllableStream<Input<Actions>>()
  #forkable = new ForkableRecallStream<Output<Actions, State>>()
  #reducers: StatefulSubjectReducers<Actions, State>
  #state!: State

  constructor(reducers: StatefulSubjectReducers<Actions, State>) {
    this.#reducers = reducers
    this.#controllable.pipeThrough(this.#transform()).pipeTo(this.#forkable)
    this.#controllable.enqueue({ action: '__INIT__' as const })
  }

  dispatch<Action extends keyof Actions>(
    ...args: Actions[Action] extends void
      ? [action: Action]
      : [action: Action, param: Actions[Action]]
  ) {
    const [action, param] = args
    this.#controllable.enqueue({ action, param } as Input<Actions>)
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

  #transform() {
    return new TransformStream<Input<Actions>, Output<Actions, State>>({
      transform: (chunk, controller) => {
        const state = this.#reduce(chunk, this.#state)
        if (state !== this.#state) {
          this.#state = Object.freeze(state)
          controller.enqueue({ ...chunk, state } as Output<Actions, State>)
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
      param?: Actions[Action]
    },
    state: State
  ) {
    return this.#reducers[action]?.(state, param) ?? state
  }
}

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

type Input<Actions extends Record<string, unknown>> = _Input<
  Actions,
  U.ListOf<keyof Actions>,
  { action: '__INIT__' }
>

type _Input<
  Actions extends Record<string, unknown>,
  ActionNames extends readonly (keyof Actions)[],
  Acc extends { action: keyof Actions; param?: unknown }
> = L.Length<ActionNames> extends 0
  ? Acc
  : _Input<
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

type Output<Actions extends Record<string, unknown>, State> = _Output<
  Actions,
  State,
  U.ListOf<keyof Actions>,
  { action: '__INIT__'; state: State }
>

type _Output<
  Actions extends Record<string, unknown>,
  State,
  ActionNames extends readonly (keyof Actions)[],
  Acc extends { action: keyof Actions; param?: unknown; state: State }
> = L.Length<ActionNames> extends 0
  ? Acc
  : _Output<
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
