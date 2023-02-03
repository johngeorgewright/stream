import { DebounceBehavior } from './Behavior'
import { DebounceState } from './State'

/**
 * Debouncing behavior to queue the leading event.
 *
 * @group Transformers
 * @see {@link debounce:function}
 * @example
 * ```
 * --a-b-c--------------d-----------
 *
 * debounce(20, new DebounceLeadingBehavior())
 *
 * ---a------------------d----------
 * ```
 */
export class DebounceLeadingBehavior<T> implements DebounceBehavior<T> {
  preTimer(
    context: DebounceState,
    chunk: T,
    controller: TransformStreamDefaultController<T>
  ): DebounceState | void {
    const enqueue = !context.timer && !context.queued
    if (enqueue) {
      controller.enqueue(chunk)
      return {
        ...context,
        queued: enqueue,
      }
    }
  }
}
