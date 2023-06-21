import {
  Controllable,
  ControllableStream,
  ControllerPullListener,
} from '../index.js'

export class SubjectController<T> implements Controllable<T> {
  #controller: ControllableStream<T>
  #onClose: () => void

  constructor(controller: ControllableStream<T>, onClose: () => void) {
    this.#controller = controller
    this.#onClose = onClose
  }

  get desiredSize() {
    return this.#controller.desiredSize
  }

  enqueue(chunk: T) {
    this.#controller.enqueue(chunk)
  }

  close() {
    this.#onClose()
  }

  cancel(reason?: unknown) {
    return this.#controller.cancel(reason)
  }

  error(reason: unknown) {
    return this.#controller.error(reason)
  }

  onPull(pullListener: ControllerPullListener<T>) {
    return this.#controller.onPull(pullListener)
  }
}
