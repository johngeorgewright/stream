import { ForkableStream } from '@johngw/stream/sinks/ForkableStream'
import { ControllableStream } from '@johngw/stream/sources/ControllableStream'
import { ControllableReadableStream } from '@johngw/stream/sources/Controllable'
import { Subjectable } from '@johngw/stream/subjects/Subjectable'

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
export interface SubjectOptions<In, Out = In> {
  controllable?: ControllableReadableStream<In>
  forkable?: ForkableStream<Out>
  pipeThroughOptions?: StreamPipeOptions
  pipeToOptions?: StreamPipeOptions
  pre?: TransformStream<In, In>[]
  post?: TransformStream<Out, Out>[]
  transform?: TransformStream<In, Out>
}

/**
 * The base class for all subjects.
 *
 * @group Subjects
 * @see {@link Subject:class}
 * @see {@link StatefulSubject:class}
 */
export class Subject<In, Out = In> implements Subjectable<In, Out> {
  #controllable: ControllableReadableStream<In>
  #controllers = new Set<ControllableReadableStream<In>>()
  #forkable: ForkableStream<Out>

  constructor({
    controllable = new ControllableStream<In>(),
    forkable = new ForkableStream(),
    pre = [],
    post = [],
    transform,
    pipeThroughOptions,
    pipeToOptions,
  }: SubjectOptions<In, Out> = {}) {
    this.#controllable = controllable
    this.#forkable = forkable

    const inReadable = pre.reduce<ReadableStream<In>>(
      (readable, transform) =>
        readable.pipeThrough(transform, pipeThroughOptions),
      controllable
    )

    ;(transform
      ? post.reduce<ReadableStream<Out>>(
          (readable, transform) =>
            readable.pipeThrough(transform, pipeThroughOptions),
          inReadable.pipeThrough(transform, pipeThroughOptions)
        )
      : (inReadable as unknown as ReadableStream<Out>)
    )
      .pipeTo(this.forkable, pipeToOptions)
      .catch(() => {
        // errors can be handled in downstream forks
      })
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

  write(queuingStrategy?: QueuingStrategy<In>): WritableStream<In> {
    const controller = this.control()
    return new WritableStream(
      {
        abort(reason) {
          controller.error(reason)
        },
        close() {
          controller.close()
        },
        write(chunk) {
          controller.enqueue(chunk)
        },
      },
      queuingStrategy
    )
  }

  /**
   * Returns a proxy to the ControllableStream. Once all proxies
   * have been closed, then the source is also closed.
   */
  control() {
    const controller: ControllableReadableStream<In> = new Proxy(
      this.#controllable,
      {
        get: (target, prop) => {
          if (prop === 'close')
            return this.#closeController.bind(this, controller)
          const value = target[prop as keyof typeof target]
          return typeof value === 'function' ? value.bind(target) : value
        },
      }
    )
    this.#controllers.add(controller)
    return controller
  }

  #closeController(controller: ControllableReadableStream<In>) {
    this.#controllers.delete(controller)
    if (!this.#controllers.size) this.#controllable.close()
  }
}
