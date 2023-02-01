import { write } from './write'

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

  return new ReadableStream<T>({
    async start(controller) {
      if (abortController.signal.aborted)
        return controller.error(abortController.signal.reason)

      await Promise.all(
        readableStreams.map((stream) =>
          stream
            .pipeTo(
              write((chunk) => controller.enqueue(chunk)),
              {
                signal: abortController.signal,
              }
            )
            .catch((error) => controller.error(error))
        )
      )

      controller.close()
    },

    cancel(reason) {
      abortController.abort(reason)
    },
  })
}
