/**
 * Creates a ReadableStream that immediately closes.
 *
 * @group Sources
 */
export function immediatelyClosingReadableStream() {
  return new ReadableStream<never>({
    start(controller) {
      controller.close()
    },
  })
}
