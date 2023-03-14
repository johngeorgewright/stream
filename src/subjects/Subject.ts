import { BaseSubject, BaseSubjectOptions } from './BaseSubject.js'

/**
 * A Subject is a combination of a {@link ControllableStream:class}
 * and a {@link ForkableStream:class} giving the developer the
 * ability to both queue items and fork the stream from the same object.
 *
 * @group Subjects
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
export class Subject<T> extends BaseSubject<T, T> {
  constructor(options?: BaseSubjectOptions<T, T>) {
    super(options)
    this.controllable
      .pipeTo(this.forkable, options?.pipeToOptions)
      .catch(() => {
        // errors can be handled in downstream forks
      })
  }
}
