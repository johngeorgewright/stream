import { Behavior } from './Behavior'
import { DebounceContext } from './DebounceContext'

export interface BackOffBehaviorOptions {
  inc(currentMS: number): number
  max?: number
}

export class BackOffBehavior<T> implements Behavior<T> {
  #inc: (currentMS: number) => number
  #max: number
  #startingMS = 0

  constructor({ inc, max = Number.MAX_SAFE_INTEGER }: BackOffBehaviorOptions) {
    this.#inc = inc
    this.#max = max
  }

  init(context: DebounceContext) {
    this.#startingMS = context.ms
  }

  preTimer(context: DebounceContext) {
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
