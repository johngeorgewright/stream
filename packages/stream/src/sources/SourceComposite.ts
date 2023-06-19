import { all } from '@johngw/stream-common/Async'
import {
  CancellableSource,
  PullableSource,
  StartableSource,
  isCancellableSource,
  isPullableSource,
  isStartableSource,
} from '@johngw/stream-common/Stream'

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
  readonly #cancellableSources: CancellableSource<T>[]
  readonly #pullableSources: PullableSource<T>[]
  readonly #startableSources: StartableSource<T>[]

  constructor(sources: UnderlyingDefaultSource<T>[]) {
    this.#cancellableSources = sources.filter(isCancellableSource)
    this.#pullableSources = sources.filter(isPullableSource)
    this.#startableSources = sources.filter(isStartableSource)
  }

  async cancel(reason: unknown) {
    await all(this.#cancellableSources, (source) => source.cancel(reason))
  }

  async pull(controller: ReadableStreamDefaultController<T>) {
    await all(this.#pullableSources, (source) => source.pull(controller))
  }

  async start(controller: ReadableStreamDefaultController<T>) {
    await all(this.#startableSources, (source) => source.start(controller))
  }
}
