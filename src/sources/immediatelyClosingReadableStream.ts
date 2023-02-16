export function immediatelyClosingReadableStream(): ReadableStream<never> {
  return new ReadableStream({
    start(controller) {
      controller.close()
    },
  })
}
