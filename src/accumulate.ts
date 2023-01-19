export function accumulate<I, O>(acc: O, fn: (acc: O, chunk: I) => O) {
  return new TransformStream<I, O>({
    transform(chunk, controller) {
      acc = fn(acc, chunk)
      controller.enqueue(acc)
    },
  })
}
