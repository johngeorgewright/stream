/**
 * @module debounce
 */

import { DebounceBehavior } from './Behavior'
import { DebounceContext } from './Context'

/**
 * The transformer implementation for [debounce](./index.ts).
 *
 * @group Debounce
 * @see [debounce](./index.ts)
 */
export class DebounceTransformer<T> implements Transformer<T, T> {
  #behaviors: DebounceBehavior<T>[]
  #context: DebounceContext

  constructor(ms: number, behaviors: DebounceBehavior<T>[]) {
    this.#behaviors = behaviors
    this.#context = this.#reduceContext('init', { ms: ms, queued: false })
  }

  transform(chunk: T, controller: TransformStreamDefaultController<T>) {
    clearTimeout(this.#context.timer)

    this.#context = this.#reduceContext(
      'preTimer',
      {
        ...this.#context,
        queued: false,
      },
      chunk,
      controller
    )

    this.#context = {
      ...this.#context,

      timer: setTimeout(() => {
        clearTimeout(this.#context.timer)
        this.#context = this.#reduceContext(
          'postTimer',
          {
            ...this.#context,
            timer: undefined,
          },
          chunk,
          controller
        )
      }, this.#context.ms),
    }
  }

  flush() {
    clearTimeout(this.#context.timer)
  }

  #reduceContext(stage: 'init', context: DebounceContext): DebounceContext

  #reduceContext(
    stage: 'preTimer' | 'postTimer',
    context: DebounceContext,
    chunk: T,
    controller: TransformStreamDefaultController<T>
  ): DebounceContext

  #reduceContext(
    stage: keyof DebounceBehavior<T>,
    context: DebounceContext,
    chunk?: T,
    controller?: TransformStreamDefaultController<T>
  ): DebounceContext {
    return this.#behaviors.reduce(
      (context, behavior) =>
        behavior[stage]?.(context, chunk!, controller!) || context,
      context
    )
  }
}
