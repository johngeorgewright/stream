import { consume } from './consume'

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
          consume(stream, (chunk) => controller.enqueue(chunk), {
            signal: abortController.signal,
          }).catch((error) => controller.error(error))
        )
      )

      controller.close()
    },

    cancel(reason) {
      abortController.abort(reason)
    },
  })
}
