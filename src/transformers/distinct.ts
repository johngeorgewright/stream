import { write } from '../sinks/write'

export interface DistinctOptions<T, K> {
  selector?: (value: T) => K
  flushes?: ReadableStream<unknown>
}

/**
 * Returns a ReadableStream that queues all items from the source Stream that are distinct by comparison from previous items.
 *
 * If a `selector` function is provided, then it will project each value from the source observable into a new value that it will
 * check for equality with previously projected values. If the `selector` function is not provided, it will use each value from the
 * source observable directly with an equality check against previous values.
 *
 * A long-running `distinct` use might result in memory leaks. To help alleviate this in some scenarios, an optional `flushes` parameter
 * is also provided so that the internal `Set` can be "flushed", basically clearing it of values.
 *
 * @group Transformers
 * @example
 * A simple example with numbers
 *
 * ```
 * --1--1--2--2--2--1--2--3--4--3--2--1--
 *
 * distinct()
 *
 * --1-----2--------------3--4-----------
 * ```
 *
 * An example using the `selector` function
 *
 * ```
 * --{a:4,n:'f'}--{a:7,n:'b'}--{a:5,n:'f'}--
 *
 * distinct({ selector: ({ n }) => n })
 *
 * --{a:4,n:'f'}--{a:7,n:'b'}---------------
 * ```
 */
export function distinct<T, K>({
  flushes,
  selector,
}: DistinctOptions<T, K> = {}) {
  const set = new Set<T | K>()

  flushes?.pipeTo(write(() => set.clear())).catch(() => {
    // ignore errors from flush stream
  })

  return new TransformStream<T, T>({
    transform(chunk, controller) {
      const key = selector ? selector(chunk) : chunk
      if (!set.has(key)) {
        set.add(key)
        controller.enqueue(chunk)
      }
    },

    flush() {
      set.clear()
    },
  })
}
