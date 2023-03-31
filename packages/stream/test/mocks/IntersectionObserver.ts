export type IntersectionObserverMock = jest.Mock<
  IntersectionObserver,
  [callback: IntersectionObserverCallback, options?: IntersectionObserverInit]
>

export type CallIntersectionObserver = (
  entries: IntersectionObserverEntry[]
) => unknown

export function mockIntersectionObserver() {
  const OriginalIntersectionObserver = window.IntersectionObserver

  const instanceSet = new Set<IntersectionObserver>()

  const callbacks = new WeakMap<
    IntersectionObserver,
    IntersectionObserverCallback
  >()

  const IntersectionObserverMock: IntersectionObserverMock =
    (window.IntersectionObserver = jest.fn((callback, options) => {
      const observer = {
        observe: jest.fn<void, [target: Element]>(),
        unobserve: jest.fn<void, [target: Element]>(),
        root: options?.root || document,
        rootMargin: options?.rootMargin
          ? typeof options.rootMargin === 'number'
            ? `${options.rootMargin}px`
            : options.rootMargin
          : '0px',
        thresholds: Array.isArray(options?.threshold)
          ? // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            options!.threshold
          : typeof options?.threshold === 'number'
          ? [options.threshold]
          : [0],
        disconnect: jest.fn<void, []>(),
        takeRecords: jest.fn<IntersectionObserverEntry[], []>(),
      }

      instanceSet.add(observer)
      callbacks.set(observer, callback)

      return observer
    }))

  return {
    IntersectionObserverMock,
    unmock() {
      window.IntersectionObserver = OriginalIntersectionObserver
      instanceSet.clear()
    },
    callIntersectionObservers(entries: IntersectionObserverEntry[]) {
      for (const instance of instanceSet) {
        const callback = callbacks.get(instance)
        callback?.(entries, instance)
      }
    },
  }
}

export function boundingClientRect({
  bottom = 1,
  height = 1,
  left = 1,
  right = 1,
  top = 1,
  width = 1,
  x = left,
  y = top,
}: Partial<DOMRectReadOnly> = {}): DOMRectReadOnly {
  const rect = {
    bottom,
    height,
    left,
    right,
    top,
    width,
    x,
    y,
  }
  return {
    ...rect,
    toJSON: () => JSON.stringify(rect),
  }
}
