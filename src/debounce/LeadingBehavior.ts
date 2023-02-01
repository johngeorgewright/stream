import { Behavior } from './Behavior'
import { DebounceContext } from './DebounceContext'

export class LeadingBehavior<T> implements Behavior<T> {
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
