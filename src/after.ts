/**
 * Prevents chunks from travelling down the stream
 * until the predicate returns true.
 */
export function after<T>(predicate: (chunk: T) => boolean | Promise<boolean>) {
  let pass = false

  return new TransformStream<T, T>({
    async transform(chunk, controller) {
      if (pass) controller.enqueue(chunk)
      else if (await predicate(chunk)) {
        pass = true
        controller.enqueue(chunk)
      }
    },
  })
}
