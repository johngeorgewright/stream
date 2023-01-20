export interface DebounceOptions {
  leading?: boolean
  trailing?: boolean
}

export function debounce<T>(
  ms: number,
  { leading, trailing }: DebounceOptions = { trailing: true }
) {
  return new TransformStream<T, T>(
    leading && trailing
      ? new LeadingAndTrailingBehavior(ms)
      : leading
      ? new LeadingBehavior(ms)
      : trailing
      ? new TrailingBehavior(ms)
      : {}
  )
}

abstract class Behavior<T> implements Transformer<T, T> {
  protected _timer?: NodeJS.Timer

  #ms: number

  constructor(ms: number) {
    this.#ms = ms
  }

  transform(chunk: T, controller: TransformStreamDefaultController<T>) {
    clearTimeout(this._timer)
    this._timer = setTimeout(
      () => this._handleTimeout(chunk, controller),
      this.#ms
    )
  }

  flush() {
    if (this._timer) clearTimeout(this._timer)
  }

  protected _handleTimeout(
    _chunk: T,
    _controller: TransformStreamDefaultController<T>
  ) {
    clearTimeout(this._timer)
    this._timer = undefined
  }
}

class LeadingBehavior<T> extends Behavior<T> {
  protected _queued = false

  override transform(
    chunk: T,
    controller: TransformStreamDefaultController<T>
  ) {
    this._queued = !this._timer
    if (this._queued) controller.enqueue(chunk)
    super.transform(chunk, controller)
  }
}

class TrailingBehavior<T> extends Behavior<T> {
  protected override _handleTimeout(
    chunk: T,
    controller: TransformStreamDefaultController<T>
  ) {
    super._handleTimeout(chunk, controller)
    controller.enqueue(chunk)
  }
}

class LeadingAndTrailingBehavior<T> extends LeadingBehavior<T> {
  protected override _handleTimeout(
    chunk: T,
    controller: TransformStreamDefaultController<T>
  ) {
    super._handleTimeout(chunk, controller)
    if (!this._queued) controller.enqueue(chunk)
  }
}
