import { Behavior } from './Behavior'
import { DebounceContext } from './DebounceContext'

export class LeadingBehavior<T> implements Behavior<T> {
  preTimer(
    chunk: T,
    controller: TransformStreamDefaultController<T>,
    context: DebounceContext
  ) {
    if (!context.timer) controller.enqueue(chunk)
    return {
      ...context,
      queued: !context.timer,
    }
  }
}
