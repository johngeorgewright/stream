export function defer<T = void>() {
  let $resolve: (value: T | PromiseLike<T>) => void
  let $reject: (reason?: unknown) => void

  return {
    promise: new Promise<T>((resolve, reject) => {
      $resolve = resolve
      $reject = reject
    }),

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    resolve: $resolve!,

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    reject: $reject!,
  }
}

export function delayedStream<T>(ms: number, items: T[]) {
  return new ReadableStream<T>({
    async pull(controller) {
      if (!items.length) return controller.close()
      await timeout(ms)
      controller.enqueue(items.shift())
    },
  })
}

export type IsString<T extends string> = T
export type IsNumber<T extends number> = T
export type IsStringOrNumber<T extends string | number> = T

export function timeout(ms?: number): Promise<void>

export function timeout<T>(
  ms: number,
  value: T,
  signal?: AbortSignal
): Promise<T>

export function timeout<T>(ms?: number, value?: T, signal?: AbortSignal) {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) return reject(signal.reason)

    const onAbort = () => {
      clearTimeout(timer)
      reject(signal?.reason)
    }

    const timer = setTimeout(
      (x: T) => {
        signal?.removeEventListener('abort', onAbort)
        resolve(x)
      },
      ms,
      value
    )

    signal?.addEventListener('abort', onAbort)
  })
}
