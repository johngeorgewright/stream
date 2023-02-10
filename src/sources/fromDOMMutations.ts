/**
 * Creates a ReadableStream from DOM mutations.
 *
 * @group Sources
 * @see {@link addedNodes:function}
 * @see {@link removedNodes:function}
 * @example
 * ```
 * fromDOMMutations(document.body, { childList: true })
 *   .pipeTo(write((mutation) => {
 *     console.info(mutation.addedNodes)
 *   }))
 * ```
 */
export function fromDOMMutations(
  target: Node,
  options?: MutationObserverInit,
  queuingStrategy?: QueuingStrategy<MutationRecord>
) {
  let observer: MutationObserver

  return new ReadableStream<MutationRecord>(
    {
      start(controller) {
        observer = new MutationObserver((mutations) => {
          for (const mutation of mutations)
            if (controller.desiredSize) controller.enqueue(mutation)
        })

        observer.observe(target, options)
      },

      cancel() {
        observer.disconnect()
      },
    },
    queuingStrategy
  )
}
