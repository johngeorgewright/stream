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
  readonly #cancellableSources: CancellableSource<T>[]
  readonly #pullableSources: PullableSource<T>[]
  readonly #startableSources: StartableSource<T>[]

  constructor(sources: UnderlyingDefaultSource<T>[]) {
    this.#cancellableSources = sources.filter(
      (source): source is CancellableSource<T> => 'cancel' in source
    )
    this.#pullableSources = sources.filter(
      (source): source is PullableSource<T> => 'cancel' in source
    )
    this.#startableSources = sources.filter(
      (source): source is StartableSource<T> => 'cancel' in source
    )
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

type CancellableSource<T> = Required<Pick<UnderlyingDefaultSource<T>, 'cancel'>>
type PullableSource<T> = Required<Pick<UnderlyingDefaultSource<T>, 'pull'>>
type StartableSource<T> = Required<Pick<UnderlyingDefaultSource<T>, 'start'>>
