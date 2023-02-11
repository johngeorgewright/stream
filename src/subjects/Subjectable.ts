import { Forkable } from '../sinks/Forkable'
import { Controllable } from '../sources/Controllable'

export interface Subjectable<Input, Output>
  extends Controllable<Input>,
    Forkable<Output> {}
