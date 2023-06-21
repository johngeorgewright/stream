import { Forkable } from '../sinks/Forkable.js'
import { Controllable } from '../sources/Controllable.js'

/**
 * A common interface for subjects.
 *
 * @group Subjects
 */
export interface Subjectable<Input, Output> extends Forkable<Output> {
  control(): Controllable<Input>
}
