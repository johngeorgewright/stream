import { Accumulator } from './util/Accumulator'

/**
 * Reduces chunks in to one accumulator. Once the stream is cancelled,
 * the accumulator will be queued.
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
