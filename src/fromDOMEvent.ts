export function fromDOMEvent<K extends keyof HTMLElementEventMap>(
  element: HTMLElement,
  type: K,
  options?: boolean | AddEventListenerOptions
): ReadableStream<HTMLElementEventMap[K]>

export function fromDOMEvent(
  element: HTMLElement,
  type: string,
  options?: boolean | AddEventListenerOptions
): ReadableStream<Event>

export function fromDOMEvent(
  element: HTMLElement,
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
