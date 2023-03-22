/**
 * Returns a promise that resolves in `ms` milliseconds.
 *
 * @group Utils
 * @category Async
 */
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
