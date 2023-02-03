import { fromIterable } from '../../src/sources/fromIterable'
import { pairwise } from '../../src/transformers/pairwise'
import { toArray } from '../../src/sinks/toArray'

test('Queues the current value and previous values', async () => {
  expect(
    await toArray(fromIterable([1, 2, 3, 4, 5]).pipeThrough(pairwise()))
  ).toEqual([
    [1, 2],
    [2, 3],
    [3, 4],
    [4, 5],
  ])
})
