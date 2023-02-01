import { Accumulator } from './util/Accumulator'

/**
 * Every chunk is added to an accumulator.
 *
 * @example
 * readable.pipeThrough(
 *   accumulate({ chunks: [], counter: 0 } (acc, chunk) => ({
 *     chunks: [...acc.chunks, chunk],
 *     counter: acc.counter + 1
 *   }))
 * )
 */
export function accumulate<I, O>(acc: O, fn: Accumulator<I, O>) {
  return new TransformStream<I, O>({
    async transform(chunk, controller) {
      acc = await fn(acc, chunk)
      controller.enqueue(acc)
    },
  })
}
