import { DebounceBehavior } from './Behavior'
import { DebounceContext } from './Context'

/**
 * @group Debounce
 */
export interface DebounceBackOffBehaviorOptions {
  /**
   * The back-off increment formular
   */
  inc(currentMS: number): number

  /**
   * An optional maximum time to reach.
   *
   * @default Number.MAX_SAFE_INTEGER
   */
  max?: number
}

/**
 * A behavior that will increase the debounce time whenever events
 * are received within the current time. It's best to be used in
 * conjunction with the {@link DebounceTrailingBehavior:class}
 * or the {@link DebounceLeadingBehavior:class}.
 *
 * @group Debounce
 * @example
 * --a--b---c----d------------------
 *
 * debounce(5, [
 *   new DebounceBackOffBehavior({ inc: (ms) => ms * 2 }),
 *   new DebounceTrailingBehavior(),
 * ])
 *
 * ---T5-T10-T20---T40--------------
 * -------------------------------d-
 */
export class DebounceBackOffBehavior<T> implements DebounceBehavior<T> {
  #inc: (currentMS: number) => number
  #max: number
  #startingMS = 0

  constructor({
    inc,
    max = Number.MAX_SAFE_INTEGER,
  }: DebounceBackOffBehaviorOptions) {
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
