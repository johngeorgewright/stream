import { Predicate } from '../util/Preciate'

/**
 * Prevents chunks from travelling down the stream
 * until the predicate returns true.
 *
 * @group Transformers
 * @example
 * ```
 * --0--1--2--3--4--5--6--1--2--3--4--
 *
 * after(x => x > 4)
 *
 * ------------------5--6--1--2--3--4-
 * ```
 */
export function after<T>(predicate: Predicate<T>) {
  let pass = false

  return new TransformStream<T, T>({
    async transform(chunk, controller) {
      if (pass) controller.enqueue(chunk)
      else if (await predicate(chunk)) {
        pass = true
        controller.enqueue(chunk)
      }
    },
  })
}
