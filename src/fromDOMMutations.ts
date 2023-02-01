export function fromDOMMutations(target: Node, options?: MutationObserverInit) {
  let observer: MutationObserver

  return new ReadableStream<MutationRecord>({
    start(controller) {
      observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) controller.enqueue(mutation)
      })

      observer.observe(target, options)
    },

    cancel() {
      observer.disconnect()
    },
  })
}
