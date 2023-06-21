import { StateReducerInput } from '../index.js'
import { SubjectController } from './SubjectController.js'

export class StatefulSubjectController<
  Actions extends Record<string, unknown>
> extends SubjectController<StateReducerInput<Actions>> {
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
    this.enqueue({
      action: args[0],
      param: args[1],
    } as StateReducerInput<Actions>)
  }
}
