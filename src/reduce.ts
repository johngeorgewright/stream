/**
 * Reduces chunks in to one accumulator. Once the stream is cancelled,
 * the accumulator will be queued.
 */
export function reduce<I, O>(
  acc: O,
  fn: (acc: O, chunk: I) => O
): ReadableWritablePair<O, I> {
  const abortController = new AbortController()

  return {
    writable: new WritableStream<I>({
      write(chunk) {
        acc = fn(acc, chunk)
      },

      close() {
        abortController.abort('success')
      },

      abort(reason) {
        abortController.abort(reason)
      },
    }),

    readable: new ReadableStream<O>({
      start(controller) {
        if (abortController.signal.aborted) return enqueue()
        abortController.signal.addEventListener('abort', enqueue)

        function enqueue() {
          if (abortController.signal.reason === 'success')
            controller.enqueue(acc)
          else controller.error(abortController.signal.reason)
          controller.close()
        }
      },
    }),
  }
}
