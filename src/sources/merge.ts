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
  readableStreams: ReadableStream<T>[]
): ReadableStream<T> {
  const abortController = new AbortController()
  const readers = readableStreams.map((stream) => stream.getReader())

  abortController.signal.addEventListener('abort', () => {
    for (const reader of readers) reader.cancel()
  })

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

    cancel(reason) {
      abortController.abort(reason)
    },
  })
}
