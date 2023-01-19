import { ReadableStreamsChunks } from './util/ReadableStreamsChunks'
import { write } from './write'

export function withLatestFrom<S, RT extends ReadableStream<unknown>[]>(
  ...inputs: RT
) {
  type Output = [S, ...ReadableStreamsChunks<RT>]

  let inputValues = new Array(inputs.length)

  const promise = Promise.all(
    inputs.map((input, index) =>
      input.pipeTo(
        write((chunk) => {
          inputValues[index] = chunk
        })
      )
    )
  )

  return new TransformStream<S, Output>({
    start(controller) {
      promise.catch((error) => controller.error(error))
    },

    transform(chunk, controller) {
      if (inputValues.some((value) => value === undefined)) return
      controller.enqueue([chunk, ...inputValues] as Output)
    },
  })
}
