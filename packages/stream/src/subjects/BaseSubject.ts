import { ForkableStream } from '../sinks/ForkableStream.js'
import { ControllerPullListener } from '../sources/Controllable.js'
import { ControllableStream } from '../sources/ControllableStream.js'
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

  get desiredSize() {
    return this.#controllable.desiredSize
  }

  enqueue(chunk: In) {
    this.#controllable.enqueue(chunk)
  }

  close() {
    this.#controllable.close()
  }

  cancel(reason?: unknown) {
    return this.#controllable.cancel(reason)
  }

  error(reason: unknown) {
    return this.#controllable.error(reason)
  }

  fork() {
    return this.#forkable.fork()
  }

  onPull(pullListener: ControllerPullListener<In>) {
    return this.#controllable.onPull(pullListener)
  }
}
