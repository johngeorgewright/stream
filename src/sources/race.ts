/**
 * Returns a `ReadableStream` that mirrors the first source stream to queue an item.
 *
 * @group Sources
 * @example
 * ```
 * ----20----40----60------
 * --1-----2-----3---------
 * -----------0-----0----0-
 *
 * race(stream1, stream2, stream3)
 *
 * --1-----2-----3---------
 * ```
 */
export function race<T>(...streams: ReadableStream<T>[]) {
  const readers = streams.map((stream) => stream.getReader())

  return new ReadableStream<T>({
    async pull(controller) {
      let result: ReadableStreamReadResult<T>

      try {
        result = await Promise.race(readers.map((reader) => reader.read()))
      } catch (error) {
        return controller.error(error)
      }

      if (result.done) controller.close()
      else controller.enqueue(result.value)
    },

    async cancel(reason) {
      await Promise.all(readers.map((reader) => reader.cancel(reason)))
    },
  })
}
