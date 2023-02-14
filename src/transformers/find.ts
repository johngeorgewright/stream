import { Predicate } from '../util/Preciate'

/**
 * Call the predicate on each chunk in the queue.
 * The first chunk to pass the predicate will be queued
 * and the stream will be terminated.
 *
 * @group Transformers
 * @example
 * ```
 * --1--2--3--4--5--6-X
 *
 * find((x) => x === 6)
 *
 * -----------------6-|
 * ```
 */
export function find<In, Out extends In>(
  predicate: (chunk: In) => chunk is Out
): TransformStream<In, Out>

export function find<In>(predicate: Predicate<In>): TransformStream<In, In>

export function find<In, Out extends In = In>(predicate: Predicate<In>) {
  return new TransformStream<In, Out>({
    async transform(chunk, controller) {
      if (await predicate(chunk)) {
        controller.enqueue(chunk as Out)
        controller.terminate()
      }
    },
  })
}
