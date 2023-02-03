import { DebounceBehavior } from './Behavior'
import { DebounceState } from './State'

/**
 * The transformer implementation for {@link debounce:function}.
 *
 * @group Transformers
 * @see {@link debounce:function}
 */
export class DebounceTransformer<T> implements Transformer<T, T> {
  #behaviors: DebounceBehavior<T>[]
  #state: DebounceState

  constructor(ms: number, behaviors: DebounceBehavior<T>[]) {
    this.#behaviors = behaviors
    this.#state = this.#reduceState('init', { ms: ms, queued: false })
  }

  transform(chunk: T, controller: TransformStreamDefaultController<T>) {
    this.#preTimer(chunk, controller)

    this.#state = {
      ...this.#state,

      timer: setTimeout(
        () => this.#postTimer(chunk, controller),
        this.#state.ms
      ),
    }
  }

  flush() {
    clearTimeout(this.#state.timer)
  }

  #preTimer(chunk: T, controller: TransformStreamDefaultController<T>) {
    clearTimeout(this.#state.timer)

    this.#state = this.#reduceState(
      'preTimer',
      {
        ...this.#state,
        queued: false,
      },
      chunk,
      controller
    )
  }

  #postTimer(chunk: T, controller: TransformStreamDefaultController<T>) {
    clearTimeout(this.#state.timer)

    this.#state = this.#reduceState(
      'postTimer',
      {
        ...this.#state,
        timer: undefined,
      },
      chunk,
      controller
    )
  }

  #reduceState(stage: 'init', state: DebounceState): DebounceState

  #reduceState(
    stage: 'preTimer' | 'postTimer',
    state: DebounceState,
    chunk: T,
    controller: TransformStreamDefaultController<T>
  ): DebounceState

  #reduceState(
    stage: keyof DebounceBehavior<T>,
    state: DebounceState,
    chunk?: T,
    controller?: TransformStreamDefaultController<T>
  ): DebounceState {
    return this.#behaviors.reduce(
      (state, behavior) =>
        behavior[stage]?.(state, chunk!, controller!) || state,
      state
    )
  }
}
