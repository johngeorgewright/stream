export interface Controllable<T> extends ReadableStreamDefaultController<T> {
  /**
   * Register a pull subscriber.
   *
   * When the stream is ready to pull it will pull from all
   * subscribers until the desired size has been fulfilled.
   */
  onPull(pullListener: ControllerPullListener<T>): void
}

export interface ControllerPullListener<T> {
  (): T | Promise<T>
}
