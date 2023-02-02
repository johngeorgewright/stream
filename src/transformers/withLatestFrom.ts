import { ReadableStreamsChunks } from '../util/ReadableStreamsChunks'
import { write } from '../sinks/write'
import { empty } from '../util/symbols'

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
) {
  type Output = [T, ...ReadableStreamsChunks<RSs>]

  const isFilled = (arr: any[]): arr is ReadableStreamsChunks<RSs> =>
    arr.every((value) => value !== empty)

  let inputValues = new Array(inputs.length).fill(empty)

  const inputValuesPromise = Promise.all(
    inputs.map((input, index) =>
      input.pipeTo(
        write((chunk) => {
          inputValues[index] = chunk
        })
      )
    )
  )

  return new TransformStream<T, Output>({
    start(controller) {
      inputValuesPromise.catch((error) => controller.error(error))
    },

    transform(chunk, controller) {
      if (isFilled(inputValues)) controller.enqueue([chunk, ...inputValues])
    },
  })
}
