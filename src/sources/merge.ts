/**
 * Merges multiple streams in to 1 ReadableStream.
 *
 * @group Sources
 * @example
 * ```
 * --1----2----3-------4-|
 * ---one---two---three---four-|
 *
 * merge([stream1, stream2])
 *
 * -1-one-2-two-3-three-4-four-|
 * ```
 */
export function merge<T>(
  ...readableStreams: ReadableStream<T>[]
): ReadableStream<T> {
  const readers = readableStreams.map((stream) => stream.getReader())

  return new ReadableStream<T>({
    async pull(controller) {
      let results: ReadableStreamReadResult<T>[]

      try {
        results = await Promise.all(readers.map((reader) => reader.read()))
      } catch (error) {
        return controller.error(error)
      }

      let done = 0
      for (const result of results) {
        if (result.done) done++
        else controller.enqueue(result.value)
      }

      if (done === readableStreams.length) controller.close()
    },

    async cancel(reason) {
      await Promise.all(readers.map((reader) => reader.cancel(reason)))
    },
  })
}
