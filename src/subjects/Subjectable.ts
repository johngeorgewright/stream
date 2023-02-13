import { Forkable } from '../sinks/Forkable'
import { Controllable } from '../sources/Controllable'

/**
 * A common interface for subjects.
 *
 * @group Subjects
 */
export interface Subjectable<Input, Output>
  extends Controllable<Input>,
    Forkable<Output> {}
