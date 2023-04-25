import { all } from '@johngw/stream-common/Async'

/**
 * A collection of `UnderlyingSink`s that implement the `UnderlyingSink`.
 *
 * @group Sinks
 * @example
 * ```
 * stream.pipeTo(
 *   new WritableStream(
 *     new SinkComposite([
 *       { write: (chunk) => console.info(`1 ${chunk}`) },
 *       { write: (chunk) => console.info(`2 ${chunk}`) },
 *     ])
 *   )
 * )
 * ```
 */
export class SinkComposite<T> implements UnderlyingSink<T> {
  readonly #abortableSinks: AbortableSink<T>[]
  readonly #closableSinks: ClosableSink<T>[]
  readonly #startableSinks: StartableSink<T>[]
  readonly #writableSinks: WritableSink<T>[]

  constructor(sinks: UnderlyingSink<T>[]) {
    this.#abortableSinks = sinks.filter(
      (sink): sink is AbortableSink<T> => 'abort' in sink
    )
    this.#closableSinks = sinks.filter(
      (sink): sink is ClosableSink<T> => 'close' in sink
    )
    this.#startableSinks = sinks.filter(
      (sink): sink is StartableSink<T> => 'start' in sink
    )
    this.#writableSinks = sinks.filter(
      (sink): sink is WritableSink<T> => 'write' in sink
    )
  }

  async abort(reason: unknown) {
    await all(this.#abortableSinks, (sink) => sink.abort(reason))
  }

  async close() {
    await all(this.#closableSinks, (sink) => sink.close())
  }

  async start(controller: WritableStreamDefaultController) {
    await all(this.#startableSinks, (sink) => sink.start(controller))
  }

  async write(chunk: T, controller: WritableStreamDefaultController) {
    await all(this.#writableSinks, (sink) => sink.write(chunk, controller))
  }
}

type AbortableSink<T> = Required<Pick<UnderlyingSink<T>, 'abort'>>
type ClosableSink<T> = Required<Pick<UnderlyingSink<T>, 'close'>>
type StartableSink<T> = Required<Pick<UnderlyingSink<T>, 'start'>>
type WritableSink<T> = Required<Pick<UnderlyingSink<T>, 'write'>>
