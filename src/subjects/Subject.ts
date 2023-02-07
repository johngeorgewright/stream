import { ForkableStream } from '../sinks/ForkableStream'
import { ControllableStream } from '../sources/ControllableStream'

/**
 * @group Subjects
 */
export interface SubjectOptions<T> {
  controllable?: ControllableStream<T>
  forkable?: ForkableStream<T>
}

/**
 * A Subject is a combination of a {@link ControllableStream:class}
 * and a {@link ForkableStream:class} giving the developer the
 * ability to both queue items and fork the stream from the same object.
 *
 * @group Subjects
 * @see {@link SubjectOptions}
 * @example
 * ```
 * const subject = new Subject<number>()
 *
 * subject.enqueue(1)
 * subject.enqueue(2)
 * subject.enqueue(3)
 *
 * subject.fork().pipeTo(write(chunk => console.info(chunk)))
 * ```
 */
export class Subject<T> {
  #controllable: ControllableStream<T>
  #forkable: ForkableStream<T>

  constructor({
    controllable = new ControllableStream<T>(),
    forkable = new ForkableStream<T>(),
  }: SubjectOptions<T> = {}) {
    this.#controllable = controllable
    this.#forkable = forkable
    this.#controllable.pipeTo(this.#forkable)
  }

  enqueue(chunk: T) {
    this.#controllable.enqueue(chunk)
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
}
