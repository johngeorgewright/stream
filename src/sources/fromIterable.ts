/**
 * Creates a readable stream from an iterable of values.
 *
 * @group Sources
 * @example
 * Using an iterable
 * ```
 * fromIterable([1, 2, 3, 4])
 * ```
 *
 * Using an Async Iterable
 * ```
 * fromIterable((async function* () {
 *   yield 1
 * })())
 * ```
 *
 * Using an ArrayLike
 * ```
 * fromIterable(document.querySelectorAll('div'))
 * ```
 */
export function fromIterable<T>(
  iterable: Iterable<T> | AsyncIterable<T> | ArrayLike<T>
) {
  return new ReadableStream(
    Symbol.iterator in iterable
      ? new IteratorSource(iterable[Symbol.iterator]())
      : Symbol.asyncIterator in iterable
      ? new IteratorSource(iterable[Symbol.asyncIterator]())
      : 'length' in iterable
      ? new ArrayLikeSource(iterable)
      : {}
  )
}

class IteratorSource<T> implements UnderlyingDefaultSource<T> {
  readonly #iterator: Iterator<T> | AsyncIterator<T>

  constructor(iterator: Iterator<T> | AsyncIterator<T>) {
    this.#iterator = iterator
  }

  async pull(controller: ReadableStreamDefaultController<T>) {
    let result: IteratorResult<T>

    try {
      result = await this.#iterator.next()
    } catch (error) {
      return controller.error(error)
    }

    if (result.done) controller.close()
    else controller.enqueue(result.value)
  }
}

class ArrayLikeSource<T> implements UnderlyingDefaultSource<T> {
  readonly #arrayLike: ArrayLike<T>
  readonly #length: number
  #i = 0

  constructor(arrayLike: ArrayLike<T>) {
    this.#arrayLike = arrayLike
    this.#length = arrayLike.length
  }

  start(controller: ReadableStreamDefaultController<T>) {
    if (this.#i === this.#length) controller.close()
  }

  pull(controller: ReadableStreamDefaultController<T>) {
    controller.enqueue(this.#arrayLike[this.#i++])
    if (this.#i === this.#length) controller.close()
  }
}