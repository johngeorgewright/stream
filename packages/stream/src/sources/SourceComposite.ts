import { all } from '@johngw/stream-common/Async'

/**
 * A collection of `UnderlyingSource`s that implement the `UnderlyingSource`.
 *
 * @group Sources
 * @example
 * ```
 * new ReadableStream(
 *   new SourceComposite([
 *     { start: (controller) => controller.enqueue('Hello') },
 *     { start: (controller) => controller.enqueue('World') },
 *   ])
 * )
 * ```
 */
export class SourceComposite<T> implements UnderlyingDefaultSource<T> {
  #sources: UnderlyingDefaultSource<T>[]

  constructor(sources: UnderlyingDefaultSource<T>[]) {
    this.#sources = sources
  }

  async cancel(reason: unknown) {
    await all(this.#sources, (source) => source.cancel?.(reason))
  }

  async pull(controller: ReadableStreamDefaultController<T>) {
    await all(this.#sources, (source) => source.pull?.(controller))
  }

  async start(controller: ReadableStreamDefaultController<T>) {
    await all(this.#sources, (source) => source.start?.(controller))
  }
}
