import { CachableStream } from '@johngw/stream/sources/CachableStream'
import { CachePullerResult } from '@johngw/stream/sources/CachableSource'
import { StorageCache } from '@johngw/stream/storages/StorageCache'

/**
 * Wraps a `ReadableStream` in a `CachableStream`.
 *
 * @group Sources
 * @example
 * ```
 * const controller = new ControllableStream<number>()
 *
 * cacheStream(
 *   new StorageCache(new MemoryCache(), 'my-cache', 30 * 60_000)),
 *   ['a', 'cache', 'path']
 *   controller,
 * )
 *   .pipeTo(write(console.info))
 * ```
 */
export function cacheStream<T>(
  cache: StorageCache,
  path: string[],
  stream: ReadableStream<T>,
  ms?: number
) {
  const reader = stream.getReader()
  return new CachableStream(
    cache,
    path,
    async () => reader.read() as Promise<CachePullerResult<T>>,
    ms
  )
}
