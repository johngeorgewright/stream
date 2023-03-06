import { fromCollection, pairwise, toArray } from '../../src'

test('Queues the current value and previous values', async () => {
  expect(
    await toArray(fromCollection([1, 2, 3, 4, 5]).pipeThrough(pairwise()))
  ).toEqual([
    [1, 2],
    [2, 3],
    [3, 4],
    [4, 5],
  ])
})
