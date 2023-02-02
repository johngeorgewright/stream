/**
 * Creates a readable stream from DOM events.
 *
 * @group Sources
 * @example
 * ```
 * fromDOMEvent(window, 'resize')
 * fromDOMEvent(document, 'click', { capture: true })
 * ```
 */
export function fromDOMEvent<K extends keyof WindowEventMap>(
  element: Window,
  type: K,
  options?: boolean | AddEventListenerOptions
): ReadableStream<WindowEventMap[K]>

export function fromDOMEvent<K extends keyof DocumentEventMap>(
  element: Document,
  type: K,
  options?: boolean | AddEventListenerOptions
): ReadableStream<DocumentEventMap[K]>

export function fromDOMEvent<K extends keyof HTMLElementEventMap>(
  element: HTMLElement,
  type: K,
  options?: boolean | AddEventListenerOptions
): ReadableStream<HTMLElementEventMap[K]>

export function fromDOMEvent(
  element: HTMLElement | Window | Document,
  type: string,
  options?: boolean | AddEventListenerOptions
): ReadableStream<Event>

export function fromDOMEvent(
  element: HTMLElement | Window | Document,
  type: string,
  options?: boolean | AddEventListenerOptions
) {
  let handler: (event: Event) => void

  return new ReadableStream({
    start(controller) {
      handler = (event) => controller.enqueue(event)
      element.addEventListener(type, handler, options)
    },

    cancel() {
      element.removeEventListener(type, handler, options)
    },
  })
}
