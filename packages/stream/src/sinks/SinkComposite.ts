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
  #sinks: UnderlyingSink<T>[]

  constructor(sinks: UnderlyingSink<T>[]) {
    this.#sinks = sinks
  }

  async abort(reason: unknown) {
    await all(this.#sinks, (sink) => sink.abort?.(reason))
  }

  async close() {
    await all(this.#sinks, (sink) => sink.close?.())
  }

  async start(controller: WritableStreamDefaultController) {
    await all(this.#sinks, (sink) => sink.start?.(controller))
  }

  async write(chunk: T, controller: WritableStreamDefaultController) {
    await all(this.#sinks, (sink) => sink.write?.(chunk, controller))
  }
}
