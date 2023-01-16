export function fromDOMEvent<K extends keyof HTMLElementEventMap>(
  element: HTMLElement,
  type: K
): ReadableStream<HTMLElementEventMap[K]>

export function fromDOMEvent(
  element: HTMLElement,
  type: string
): ReadableStream<Event>

export function fromDOMEvent(element: HTMLElement, type: string) {
  let handler: (event: Event) => void

  return new ReadableStream({
    start(controller) {
      handler = (event) => controller.enqueue(event)
      element.addEventListener(type, handler)
    },

    cancel() {
      element.removeEventListener(type, handler)
    },
  })
}
