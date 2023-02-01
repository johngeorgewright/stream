/**
 * @module debounce
 */

import { DebounceBehavior } from './Behavior'
import { DebounceContext } from './Context'

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
 * debounce(20, new TrailingBehavior())
 *
 * ----------a------------------c----------------d--
 * ```
 */
export class DebounceTrailingBehavior<T> implements DebounceBehavior<T> {
  postTimer(
    context: DebounceContext,
    chunk: T,
    controller: TransformStreamDefaultController<T>
  ): DebounceContext | void {
    if (!context.queued) {
      controller.enqueue(chunk)
      return {
        ...context,
        queued: true,
      }
    }
  }
}
