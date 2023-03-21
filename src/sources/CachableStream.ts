import { timeout } from '../utils/Async.js'
import { StorageCache } from '../storages/StorageCache.js'

/**
 * An extension to the `ReadableStream` that queues items
 * only when a timed cache becomes invalid.
 *
 * @group Sources
 * @see {@link StorageCache:class}
 * @example
 * Caching for 30 minutes.
 *
 * ```
 * const cache = new StorageCache(
 *   localStorage,
 *   'my-cache',
 *   30 * 60 * 60 * 1_000
 * )
 *
 * let i = 0
 * const stream = new CachableStream<number>(
 *   cache,
 *   ['numbers'],
 *   () => ++i
 * )
 *
 * stream.pipeTo(write(console.info))
 * // 1
 *
 * await setTimeout(30 * 60 * 60 * 1_000))
 * // 2
 * ```
 * @example
 * Manually invalidating cache
 *
 * ```
 * const cache = new StorageCache(
 *   localStorage,
 *   'my-cache',
 *   30 * 60 * 60 * 1_000
 * )
 *
 * let i = 0
 * const stream = new CachableStream<number>(
 *   cache,
 *   ['numbers'],
 *   () => ++i
 * )
 *
 * stream.pipeTo(write(console.info))
 * // 1
 *
 * stream.invalidate()
 * // 2
 * ```
 */
export class CachableStream<T> extends ReadableStream<T> {
  #abortController = new AbortController()
  readonly #cache: StorageCache
  readonly #path: string[]

  constructor(
    cache: StorageCache,
    path: string[],
    pull: () => T | Promise<T>,
    ms: number = cache.ms
  ) {
    super({
      pull: async (controller) => {
        let item = cache.get(this.#path)
        if (!item) {
          item = await pull()
          cache.set(this.#path, item, ms)
        }
        controller.enqueue(item as T)
        await this.#wait(cache.timeLeft(this.#path))
      },

      cancel: (reason) => {
        this.#abortController.abort(reason)
      },
    })

    this.#cache = cache
    this.#path = path
  }

  async #wait(ms: number) {
    try {
      await timeout(ms, undefined, this.#abortController.signal)
    } catch (error) {
      //
    }
  }

  invalidate() {
    this.#cache.unset(this.#path)
    this.#abortController.abort('invalidate')
    this.#abortController = new AbortController()
  }
}
