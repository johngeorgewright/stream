import { ReadableStreamsChunks } from './util/ReadableStreamsChunks'
import { write } from './write'

const unfilled = Symbol()

export function withLatestFrom<T, RSs extends ReadableStream<unknown>[]>(
  ...inputs: RSs
) {
  type Output = [T, ...ReadableStreamsChunks<RSs>]

  const isFilled = (arr: any[]): arr is ReadableStreamsChunks<RSs> =>
    arr.every((value) => value !== unfilled)

  let inputValues = new Array(inputs.length).fill(unfilled)

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
