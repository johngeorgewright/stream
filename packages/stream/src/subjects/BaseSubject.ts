import { without } from '@johngw/stream-common'
import { ForkableStream } from '../sinks/ForkableStream.js'
import { ControllableStream } from '../sources/ControllableStream.js'
import { SubjectController } from './SubjectController.js'
import { Subjectable } from './Subjectable.js'

/**
 * The constructor options for {@link BaseSubject}.
 *
 * @group Subjects
 */
export interface BaseSubjectOptions<In, Out> {
  controllable?: ControllableStream<In>
  forkable?: ForkableStream<Out>
  pipeToOptions?: StreamPipeOptions
}

/**
 * The base class for all subjects.
 *
 * @group Subjects
 * @see {@link Subject:class}
 * @see {@link StatefulSubject:class}
 */
export abstract class BaseSubject<In, Out> implements Subjectable<In, Out> {
  #controllable: ControllableStream<In>
  #forkable: ForkableStream<Out>
  protected controllers: SubjectController<In>[] = []

  constructor({
    controllable = new ControllableStream(),
    forkable = new ForkableStream(),
  }: BaseSubjectOptions<In, Out> = {}) {
    this.#controllable = controllable
    this.#forkable = forkable
  }

  protected get controllable() {
    return this.#controllable
  }

  get finished() {
    return this.#forkable.finished
  }

  protected get forkable() {
    return this.#forkable
  }

  fork() {
    return this.#forkable.fork()
  }

  /**
   * Returns a new {@link ControllableStream}. Once all controllers
   * have been closed, then the source is also closed.
   */
  control() {
    const controller = new SubjectController(this.#controllable, () => {
      this.controllers = without(this.controllers, controller)
      if (!this.controllers.length) this.#controllable.close()
    })
    this.controllers.push(controller)
    return controller
  }
}
