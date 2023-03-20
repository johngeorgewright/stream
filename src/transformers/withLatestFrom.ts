import { ReadableStreamsChunks } from '../utils/Stream.js'
import { empty } from '../utils/Symbol.js'
import { ControllableStream } from '../sources/ControllableStream.js'

/**
 * Combines the source Observable with other Observables to create an Observable
 * whose values are calculated from the latest values of each, only when the source emits.
 *
 * @group Transformers
 * @example
 * ```
 * --a-----b-------c---d---e--
 *
 * withLatestFrom(
 * -----1----2-3-4------------
 * )
 *
 * --------b1------c4--d4--e4-
 * ```
 */
export function withLatestFrom<T, RSs extends ReadableStream<unknown>[]>(
  ...inputs: RSs
): ReadableWritablePair<[T, ...ReadableStreamsChunks<RSs>], T> {
  const abortController = new AbortController()

  const isFilled = (arr: unknown[]): arr is ReadableStreamsChunks<RSs> =>
    arr.every((value) => value !== empty)

  const inputValues: unknown[] = inputs.map(() => empty)

  inputs.forEach((input, index) =>
    input
      .pipeTo(
        new WritableStream({
          abort(reason) {
            abortController.abort(reason)
          },
          write(chunk) {
            inputValues[index] = chunk
          },
        }),
        { signal: abortController.signal }
      )
      .catch(() => {
        // errors are handled in the stream object
      })
  )

  const readable = new ControllableStream<[T, ...ReadableStreamsChunks<RSs>]>({
    start,

    cancel(reason) {
      abortController.abort(reason)
    },
  })

  const writable = new WritableStream<T>({
    start,

    write(chunk) {
      if (isFilled(inputValues)) readable.enqueue([chunk, ...inputValues])
    },

    abort(reason) {
      abortController.abort(reason)
    },

    close() {
      readable.close()
    },
  })

  return { readable, writable }

  function start(
    controller:
      | ReadableStreamDefaultController<[T, ...ReadableStreamsChunks<RSs>]>
      | WritableStreamDefaultController
  ) {
    const onAbort = () => controller.error(abortController.signal.reason)
    abortController.signal.addEventListener('abort', onAbort)
  }
}
