import { get, isNonNullObject, set, unset } from '../utils/Object.js'

/**
 * Timed cache using a `Storage` interface.
 *
 * @group Storages
 * @example
 * Letting cache expire.
 *
 * ```
 * const cache = new StorageCache(localStorage, 'my-cache', 30 * 60 * 60 * 1_000)
 *
 * cache.set(['a', 'path'], 'foo')
 * cache.get(['a', 'path'])
 * // 'foo'
 *
 * await setTimeout(30 * 60 * 60 * 1_000)
 * cache.get(['a', 'path'])
 * // undefined
 * ```
 * @example
 * Manually invalidating cache.
 *
 * ```
 * const cache = new StorageCache(localStorage, 'my-cache', 30 * 60 * 60 * 1_000)
 * cache.set(['foo', 'bar'], 'a')
 * cache.set(['foo', 'rab'], 'b')
 *
 * // Remove a specific cache item
 * cache.unset(['foo', 'bar'])
 *
 * // Remove all "foos"
 * cache.unset(['foo'])
 * ```
 */
export class StorageCache {
  #storage: Storage
  #key: string
  #ms: number

  constructor(storage: Storage, key: string, ms: number) {
    this.#storage = storage
    this.#key = key
    this.#ms = ms
  }

  get ms() {
    return this.#ms
  }

  set(path: string[], value: unknown, ms = this.#ms) {
    this.#save(
      set(this.getAll(), path, {
        t: Date.now() + ms,
        v: value,
      })
    )
  }

  unset(path: string[]) {
    this.#save(unset(this.getAll(), path))
  }

  get(path: string[]) {
    return this.#get(path)?.v
  }

  /**
   * Returns the remaining cache time for an item.
   */
  timeLeft(path: string[]) {
    const now = Date.now()
    return (this.#get(path)?.t || now) - now
  }

  #get(path: string[]) {
    const result = get(this.getAll(), path)
    if (!isStoredItem(result)) return undefined
    if (result.t < Date.now()) {
      this.unset(path)
      return undefined
    }
    return result
  }

  #save(obj: Record<string, unknown>) {
    this.#storage.setItem(this.#key, JSON.stringify(obj))
  }

  getAll() {
    return JSON.parse(this.#storage.getItem(this.#key) || '{}')
  }
}

interface StoredItem<T> {
  t: number
  v: T
}

function isStoredItem<T>(x: unknown): x is StoredItem<T> {
  return isNonNullObject(x) && typeof x.t === 'number' && 'v' in x
}
