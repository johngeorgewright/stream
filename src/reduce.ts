/**
 * Reduces chunks in to one accumulator. Once the stream is cancelled,
 * the accumulator will be queued.
 */
export function reduce<I, O>(acc: O, fn: (acc: O, chunk: I) => O) {
  return new TransformStream<I, O>({
    transform(chunk) {
      acc = fn(acc, chunk)
    },

    flush(controller) {
      controller.enqueue(acc)
    },
  })
}
