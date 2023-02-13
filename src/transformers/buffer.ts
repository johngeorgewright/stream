import { write } from '../sinks/write'

/**
 * Buffers the source stream chunks until `notifier` emits.
 *
 * @group Transformers
 * @example
 * ```
 * --a--b--c--d--e--f--g--h--i--|
 * --------B--------B--------B--|
 *
 * buffer(notifier)
 *
 * --------[a,b,c]--[d,e,f]--[g,h,i]-|
 * ```
 */
export function buffer<T>(
  notifier: ReadableStream<unknown>,
  maxBuffer = Infinity
) {
  let buffer: T[] = []

  return new TransformStream<T, T[]>({
    start(controller) {
      notifier
        .pipeTo(
          write(() => {
            if (buffer.length) {
              controller.enqueue(buffer)
              buffer = []
            }
          })
        )
        .then(() => controller.terminate())
        .catch((error) => controller.error(error))
    },

    transform(chunk: T) {
      buffer.push(chunk)
      if (buffer.length > maxBuffer) buffer.shift()
    },

    flush(controller) {
      controller.enqueue(buffer)
    },
  })
}
