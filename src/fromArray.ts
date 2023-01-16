/**
 * Creates a readable stream from an array of values.
 */
export function fromArray<T>(array: T[]) {
  return new ReadableStream<T>({
    start(controller) {
      for (const item of array) controller.enqueue(item)
      controller.close()
    },
  })
}
