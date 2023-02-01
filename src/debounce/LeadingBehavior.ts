/**
 * @module debounce
 */

import { DebounceBehavior } from './Behavior'
import { DebounceContext } from './Context'

/**
 * Debouncing behavior to queue the leading event.
 *
 * @group Debounce
 * @see [debounce](./index.ts)
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
    context: DebounceContext,
    chunk: T,
    controller: TransformStreamDefaultController<T>
  ) {
    const enqueue = !context.timer && !context.queued
    if (enqueue) controller.enqueue(chunk)
    return {
      ...context,
      queued: enqueue,
    }
  }
}
