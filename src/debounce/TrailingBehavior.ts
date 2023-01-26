import { Behavior } from './Behavior'
import { DebounceContext } from './DebounceContext'

export class TrailingBehavior<T> implements Behavior<T> {
  postTimer(
    chunk: T,
    controller: TransformStreamDefaultController<T>,
    context: DebounceContext
  ) {
    if (!context.queued) {
      controller.enqueue(chunk)
      return {
        ...context,
        queued: true,
      }
    }
    return context
  }
}
