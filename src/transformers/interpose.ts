/**
 * Hold up a stream until a promise resolves. If it errors,
 * the error will be emitted to the stream.
 *
 * @group Transformers
 * @example
 * ```
 * ----a-------b------|
 *
 * interpose(async () => await setTimeout(50))
 *
 * --------a--------b-|
 * ```
 */
export function interpose<T>(fn: (chunk: T) => Promise<void>) {
  return new TransformStream<T, T>({
    async transform(chunk, controller) {
      try {
        await fn(chunk)
      } catch (error) {
        return controller.error(error)
      }
      controller.enqueue(chunk)
    },
  })
}
