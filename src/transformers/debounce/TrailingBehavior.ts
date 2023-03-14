import { DebounceBehavior } from './Behavior.js'
import { DebounceState } from './State.js'

/**
 * Debouncing behavior to queue the trailing event.
 *
 * @group Transformers
 * @see {@link debounce:function}
 * @example
 * ```
 * --a-----------------b-c--------------d-----------
 *
 * debounce(20)
 * // Same as...
 * debounce(20, new DebounceTrailingBehavior())
 *
 * ----------a------------------c----------------d--
 * ```
 */
export class DebounceTrailingBehavior<T> implements DebounceBehavior<T> {
  postTimer(
    state: DebounceState,
    chunk: T,
    controller: TransformStreamDefaultController<T>
  ): DebounceState | void {
    const enqueue = !state.queued
    if (enqueue) {
      controller.enqueue(chunk)
      return {
        ...state,
        queued: enqueue,
      }
    }
  }
}
