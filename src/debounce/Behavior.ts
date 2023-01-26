import { DebounceContext } from './DebounceContext'

export interface Behavior<T> {
  /**
   * Called only once, when the debouncer is constructed.
   */
  init?(context: DebounceContext): DebounceContext

  /**
   * This is will be called once for every chunk received and before
   * the timer has been set.
   */
  preTimer?(
    chunk: T,
    controller: TransformStreamDefaultController<T>,
    context: DebounceContext
  ): DebounceContext

  /**
   * Called after timer has timed out.
   */
  postTimer?(
    chunk: T,
    controller: TransformStreamDefaultController<T>,
    context: DebounceContext
  ): DebounceContext
}
