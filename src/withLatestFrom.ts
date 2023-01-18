import { ForkableBehaviorStream } from './ForkableBehaviorStream'
import { write } from './write'

export function withLatestFrom<S, T>(input: ReadableStream<T>) {
  let inputValue: T | undefined
  const inputBehaviour = new ForkableBehaviorStream(input)

  inputBehaviour.fork().pipeTo(
    write((chunk) => {
      inputValue = chunk
    })
  )

  return new TransformStream<{ source: S; input: T }>({
    transform(chunk, controller) {
      if (inputValue !== undefined)
        controller.enqueue({ source: chunk, input: inputValue })
    },
  })
}
