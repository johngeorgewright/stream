import { Forkable } from '@johngw/stream/sinks/Forkable'
import { Controllable } from '@johngw/stream/sources/Controllable'

/**
 * A common interface for subjects.
 *
 * @group Subjects
 */
export interface Subjectable<Input, Output = Input> extends Forkable<Output> {
  control(): Controllable<Input>
}
