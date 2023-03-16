import assertNever from 'assert-never'
import {
  isArrayLike,
  isAsyncIterable,
  isIterable,
  isIteratorOrAsyncIterator,
} from '../utils/Object.js'

/**
 * Creates a readable stream from an collection of values.
 *
 * @group Sources
 * @example
 * Using an iterable
 * ```
 * fromCollection([1, 2, 3, 4])
 * ```
 *
 * Using an Async Iterable
 * ```
 * fromCollection((async function* () {
 *   yield 1
 * })())
 * ```
 *
 * Using an ArrayLike
 * ```
 * fromCollection({
 *   0: 'zero',
 *   1: 'one',
 *   2: 'two',
 *   length: 3,
 * })
 * ```
 */
export function fromCollection<T>(
  collection:
    | Iterator<T>
    | Iterable<T>
    | AsyncIterator<T>
    | AsyncIterable<T>
    | ArrayLike<T>,
  queuingStrategy?: QueuingStrategy<T>
) {
  return new ReadableStream(
    isIterable<T>(collection)
      ? new IteratorSource(collection[Symbol.iterator]())
      : isAsyncIterable<T>(collection)
      ? new IteratorSource(collection[Symbol.asyncIterator]())
      : isIteratorOrAsyncIterator<T>(collection)
      ? new IteratorSource(collection)
      : isArrayLike<T>(collection)
      ? new ArrayLikeSource(collection)
      : assertNever(collection),
    queuingStrategy
  )
}

/**
 * An underlying source for an `Iterator` or `AsyncIterator`.
 *
 * @group Sources
 * @example
 * ```
 * const reader = new ReadableStream(new IteratorSource((function* () {
 *   yield 1
 *   yield 2
 * })()))
 * ```
 */
export class IteratorSource<T> implements UnderlyingDefaultSource<T> {
  readonly #iterator: Iterator<T> | AsyncIterator<T>
  readonly cancel?: UnderlyingSourceCancelCallback

  constructor(
    iterator: Iterator<T> | AsyncIterator<T>,
    onCancel?: UnderlyingSourceCancelCallback
  ) {
    this.#iterator = iterator
    this.cancel = onCancel
  }

  async pull(controller: ReadableStreamDefaultController<T>): Promise<void> {
    let result: IteratorResult<T>

    try {
      result = await this.#iterator.next()
    } catch (error) {
      return controller.error(error)
    }

    if (result.done) controller.close()
    else {
      controller.enqueue(result.value)
      if (controller.desiredSize) return this.pull(controller)
    }
  }
}

/**
 * An underlying source for an `ArrayLike`.
 *
 * @group Sources
 * @example
 * ```
 * const reader = new ReadableStream(new ArrayLikeSource({
 *   0: 'zero',
 *   1: 'one',
 *   length: 2
 * }))
 * ```
 */
export class ArrayLikeSource<T> implements UnderlyingDefaultSource<T> {
  readonly #arrayLike: ArrayLike<T>
  readonly #length: number
  #i = 0

  constructor(arrayLike: ArrayLike<T>) {
    this.#arrayLike = arrayLike
    this.#length = arrayLike.length
  }

  start(controller: ReadableStreamDefaultController<T>) {
    if (this.#finished) controller.close()
  }

  pull(controller: ReadableStreamDefaultController<T>): void {
    for (; controller.desiredSize && this.#i < this.#length; this.#i++)
      controller.enqueue(this.#arrayLike[this.#i])
    if (this.#finished) controller.close()
  }

  get #finished() {
    return this.#i === this.#length
  }
}
