/**
 * Creates a ReadableStream that immediately closes.
 *
 * @group Sources
 */
export function immediatelyClosingReadableStream(): ReadableStream<never> {
  return new ReadableStream({
    start(controller) {
      controller.close()
    },
  })
}
