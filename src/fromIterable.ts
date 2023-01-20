/**
 * Creates a readable stream from an iterable of values.
 */
export function fromIterable<T>(
  iterable:
    | Iterable<T>
    | AsyncIterable<T>
    | { length: number; [index: number]: T }
) {
  return new ReadableStream<T>({
    async start(controller) {
      if (Symbol.iterator in iterable)
        for (const item of iterable) controller.enqueue(item)
      else if (Symbol.asyncIterator in iterable)
        for await (const item of iterable) controller.enqueue(item)
      else
        for (let i = 0; i < iterable.length; i++)
          controller.enqueue(iterable[i])
      controller.close()
    },
  })
}
