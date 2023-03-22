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
  readonly #ms: number
  readonly #path: string[]
  readonly #pullItem: () => T | Promise<T>

  constructor(
    cache: StorageCache,
    path: string[],
    pullItem: () => T | Promise<T>,
    ms: number = cache.ms
  ) {
    super({
      start: async (controller) => {
        let item = cache.get(path)
        if (typeof item === 'undefined') {
          item = await pullItem()
          cache.set(path, item, ms)
        }
        controller.enqueue(item as T)
      },

      pull: (controller) => this.#pull(controller),

      cancel: (reason) => {
        this.#abortController.abort(reason)
      },
    })

    this.#cache = cache
    this.#ms = ms
    this.#path = path
    this.#pullItem = pullItem
  }

  async #wait(ms: number) {
    if (ms <= 0) return
    try {
      await timeout(ms, undefined, this.#abortController.signal)
    } catch (error) {
      //
    }
  }

  async #pull(controller: ReadableStreamDefaultController<T>): Promise<void> {
    let item = this.#cache.get(this.#path)

    if (typeof item === 'undefined') {
      item = await this.#pullItem()
      this.#cache.set(this.#path, item, this.#ms)
      controller.enqueue(item as T)
    } else {
      await this.#wait(this.#cache.timeLeft(this.#path))
    }

    if (controller.desiredSize) return this.#pull(controller)
  }

  invalidate() {
    this.#cache.unset(this.#path)
    this.#abortController.abort('invalidate')
    this.#abortController = new AbortController()
  }
}
