import { DebounceContext } from './Context'

/**
 * Debouncing requires at least one behavior that implements
 * the DebounceBehavior.
 *
 * @group Transformers
 * @see {@link debounce:function}
 */
export interface DebounceBehavior<T> {
  /**
   * Called only once, when the debouncer is constructed.
   */
  init?(context: DebounceContext): DebounceContext | void

  /**
   * This is will be called once for every chunk received and before
   * the timer has been set.
   */
  preTimer?(
    context: DebounceContext,
    chunk: T,
    controller: TransformStreamDefaultController<T>
  ): DebounceContext | void

  /**
   * Called after timer has timed out.
   */
  postTimer?(
    context: DebounceContext,
    chunk: T,
    controller: TransformStreamDefaultController<T>
  ): DebounceContext | void
}
