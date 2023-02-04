import { ReadableStreamsChunks } from '../util/ReadableStreamsChunks'
import { write } from '../sinks/write'
import { empty } from '../util/symbols'
import { ControllableStream } from '../sources/ControllableStream'

/**
 * Combines the source Observable with other Observables to create an Observable
 * whose values are calculated from the latest values of each, only when the source emits.
 *
 * @group Transformers
 * @example
 * ```
 * --a-----b-------c---d---e--
 * -----1----2-3-4------------
 *
 * withLatestFrom(stream2)
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

  const inputValues = new Array(inputs.length).fill(empty)

  const inputValuesPromise = Promise.all(
    inputs.map((input, index) =>
      input.pipeTo(
        write((chunk) => {
          inputValues[index] = chunk
        }),
        { signal: abortController.signal }
      )
    )
  )

  const readable = new ControllableStream<[T, ...ReadableStreamsChunks<RSs>]>({
    start(controller) {
      inputValuesPromise.catch((error) => controller.error(error))
    },

    cancel(reason) {
      abortController.abort(reason)
    },
  })

  const writable = new WritableStream<T>({
    start(controller) {
      inputValuesPromise.catch((error) => controller.error(error))
      abortController.signal.addEventListener('abort', () =>
        controller.error(abortController.signal.reason)
      )
    },

    write(chunk) {
      if (isFilled(inputValues)) readable.enqueue([chunk, ...inputValues])
    },

    abort(reason) {
      readable.close()
      readable.cancel(reason)
    },

    close() {
      readable.close()
    },
  })

  return { readable, writable }
}
