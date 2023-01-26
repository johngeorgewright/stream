import { Behavior } from './Behavior'
import { DebounceContext } from './DebounceContext'

export class BackOffBehavior<T> implements Behavior<T> {
  #inc: (currentMS: number) => number
  #max: number
  #startingMS = 0

  constructor({
    inc,
    max = Number.MAX_SAFE_INTEGER,
  }: {
    inc(currentMS: number): number
    max?: number
  }) {
    this.#inc = inc
    this.#max = max
  }

  init(context: DebounceContext) {
    this.#startingMS = context.ms
    return context
  }

  preTimer(
    _chunk: T,
    _controller: TransformStreamDefaultController<T>,
    context: DebounceContext
  ) {
    return context.timer
      ? {
          ...context,
          ms: Math.min(this.#inc(context.ms), this.#max),
        }
      : {
          ...context,
          ms: this.#startingMS,
        }
  }
}
