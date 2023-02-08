/**
 * Deeply flattens `Iterable`s, `AsyncIterable`s & `ArrayLike`s.
 *
 * @group Transformers
 * @example
 * ```
 * --[1]--2----[3,[4]]---|
 *
 * flat()
 *
 * --1----2-----3-4------|
 * ```
 */
export function flat<T>() {
  return new TransformStream(new FlatTransformer<T>())
}

type Input<T> = T | ArrayLike<T> | Iterable<T> | AsyncIterable<T>

class FlatTransformer<T> implements Transformer<Input<T>, T> {
  async transform(
    chunk: Input<T>,
    controller: TransformStreamDefaultController<T>
  ) {
    if (typeof chunk === 'object' && chunk !== null) {
      if (Symbol.iterator in chunk)
        await this.#transformIterator(chunk, controller)
      else if (Symbol.asyncIterator in chunk)
        await this.#transformAsyncIterator(chunk, controller)
      else if ('length' in chunk)
        await this.#transformArrayLike(chunk, controller)
      else controller.enqueue(chunk)
    } else controller.enqueue(chunk)
  }

  async #transformIterator(
    chunk: Iterable<T>,
    controller: TransformStreamDefaultController<T>
  ) {
    for (const x of chunk) await this.transform(x, controller)
  }

  async #transformAsyncIterator(
    chunk: AsyncIterable<T>,
    controller: TransformStreamDefaultController<T>
  ) {
    for await (const x of chunk) await this.transform(x, controller)
  }

  async #transformArrayLike(
    chunk: ArrayLike<T>,
    controller: TransformStreamDefaultController<T>
  ) {
    for (let i = 0; i < chunk.length; i++)
      await this.transform(chunk[i], controller)
  }
}
