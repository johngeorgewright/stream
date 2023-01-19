/**
 * Transforms chunks from one value to another.
 */
export function map<I, O>(fn: (x: I) => O | Promise<O>) {
  return new TransformStream<I, O>({
    async transform(chunk, controller) {
      controller.enqueue(await fn(chunk))
    },
  })
}
