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

type DebounceContext = Readonly<{
  queued?: boolean
  ms: number
  timer?: NodeJS.Timer
}>

class DebounceTransformer<T> implements Transformer<T, T> {
  #behaviors: Behavior<T>[]
  #context: DebounceContext

  constructor(ms: number, behaviors: Behavior<T>[]) {
    this.#behaviors = behaviors
    this.#context = this.#init({ ms: ms })
  }

  transform(chunk: T, controller: TransformStreamDefaultController<T>) {
    clearTimeout(this.#context.timer)
    this.#context = this.#preTimer(chunk, controller, this.#context)
    this.#context = {
      ...this.#context,
      timer: setTimeout(() => {
        clearTimeout(this.#context.timer)
        this.#context = this.#postTimer(chunk, controller, {
          ...this.#context,
          timer: undefined,
        })
      }, this.#context.ms),
    }
  }

  flush() {
    clearTimeout(this.#context.timer)
  }

  #init(context: DebounceContext) {
    return this.#behaviors.reduce(
      (context, behavior) => behavior.init?.(context) || context,
      context
    )
  }

  #preTimer(
    chunk: T,
    controller: TransformStreamDefaultController<T>,
    context: DebounceContext
  ) {
    return this.#behaviors.reduce(
      (context, behavior) =>
        behavior.preTimer?.(chunk, controller, context) || context,
      context
    )
  }

  #postTimer(
    chunk: T,
    controller: TransformStreamDefaultController<T>,
    context: DebounceContext
  ) {
    return this.#behaviors.reduce(
      (context, behavior) =>
        behavior.postTimer?.(chunk, controller, context) || context,
      context
    )
  }
}

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
    _chunk: T,
    _controller: TransformStreamDefaultController<T>,
    context: DebounceContext
  ): DebounceContext

  /**
   * Called after timer has timed out.
   */
  postTimer?(
    _chunk: T,
    _controller: TransformStreamDefaultController<T>,
    context: DebounceContext
  ): DebounceContext
}

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

export class BackOffBehaviour<T> implements Behavior<T> {
  #inc: (currentMS: number) => number
  #max: number
  #startingMS = 0

  constructor({
    inc,
    max = Number.MAX_SAFE_INTEGER,
  }: {
    inc(currentMS: number): number
    max?: number
  }) {
    this.#inc = inc
    this.#max = max
  }

  init(context: DebounceContext) {
    this.#startingMS = context.ms
    return context
  }

  preTimer(
    _chunk: T,
    _controller: TransformStreamDefaultController<T>,
    context: DebounceContext
  ) {
    return context.timer
      ? {
          ...context,
          ms: Math.min(this.#inc(context.ms), this.#max),
        }
      : {
          ...context,
          ms: this.#startingMS,
        }
  }
}
