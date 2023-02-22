import { Accumulator } from '../utils/Function'

/**
 * Reduces chunks in to one accumulator. Once the stream is cancelled,
 * the accumulator will be queued.
 *
 * @group Transformers
 * @see {@link accumulate:function}
 * @example
 *
 * --a-------b-------c-----|
 *
 * reduce([], (acc, chunk) => [...acc, chunk])
 *
 * ------------------------[a,b,c]-|
 */
export function reduce<I, O>(acc: O, fn: Accumulator<I, O>) {
  return new TransformStream<I, O>({
    async transform(chunk) {
      acc = await fn(acc, chunk)
    },

    flush(controller) {
      controller.enqueue(acc)
    },
  })
}
