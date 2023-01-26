import { Behavior } from './Behavior'
import { DebounceTransformer } from './DebounceTransformer'
import { TrailingBehavior } from './TrailingBehavior'

export function debounce<T>(
  ms: number,
  behaviors?: Behavior<T> | Behavior<T>[]
) {
  return new TransformStream<T, T>(
    new DebounceTransformer(
      ms,
      !behaviors
        ? [new TrailingBehavior()]
        : Array.isArray(behaviors)
        ? behaviors
        : [behaviors]
    )
  )
}
