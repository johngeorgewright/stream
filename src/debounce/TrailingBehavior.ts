import { Behavior } from './Behavior'
import { DebounceContext } from './DebounceContext'

export class TrailingBehavior<T> implements Behavior<T> {
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
