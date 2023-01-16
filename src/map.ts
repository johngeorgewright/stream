/**
 * Transforms chunks from one value to another.
 */
export function map<I, O>(fn: (x: I) => O) {
  return new TransformStream<I, O>({
    transform(chunk, controller) {
      controller.enqueue(fn(chunk))
    },
  })
}
