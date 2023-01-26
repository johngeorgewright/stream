import { Behavior } from './Behavior'
import { DebounceContext } from './DebounceContext'

export class DebounceTransformer<T> implements Transformer<T, T> {
  #behaviors: Behavior<T>[]
  #context: DebounceContext

  constructor(ms: number, behaviors: Behavior<T>[]) {
    this.#behaviors = behaviors
    this.#context = this.#init({ ms: ms })
  }

  transform(chunk: T, controller: TransformStreamDefaultController<T>) {
    clearTimeout(this.#context.timer)
    this.#context = this.#preTimer(chunk, controller, this.#context)
    this.#context = {
      ...this.#context,
      timer: setTimeout(() => {
        clearTimeout(this.#context.timer)
        this.#context = this.#postTimer(chunk, controller, {
          ...this.#context,
          timer: undefined,
        })
      }, this.#context.ms),
    }
  }

  flush() {
    clearTimeout(this.#context.timer)
  }

  #init(context: DebounceContext) {
    return this.#behaviors.reduce(
      (context, behavior) => behavior.init?.(context) || context,
      context
    )
  }

  #preTimer(
    chunk: T,
    controller: TransformStreamDefaultController<T>,
    context: DebounceContext
  ) {
    return this.#behaviors.reduce(
      (context, behavior) =>
        behavior.preTimer?.(chunk, controller, context) || context,
      context
    )
  }

  #postTimer(
    chunk: T,
    controller: TransformStreamDefaultController<T>,
    context: DebounceContext
  ) {
    return this.#behaviors.reduce(
      (context, behavior) =>
        behavior.postTimer?.(chunk, controller, context) || context,
      context
    )
  }
}
