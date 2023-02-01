import { fromIterable } from '../src/sources/fromIterable'
import { reduce } from '../src/transformers/reduce'
import { toArray } from '../src/sinks/toArray'

test('accumulates values from a stream', async () => {
  expect(
    await toArray(
      fromIterable([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]).pipeThrough(
        reduce({} as Record<string, number>, (acc, chunk) => ({
          ...acc,
          [chunk.toString()]: chunk,
        }))
      )
    )
  ).toEqual([
    {
      0: 0,
      1: 1,
      2: 2,
      3: 3,
      4: 4,
      5: 5,
      6: 6,
      7: 7,
      8: 8,
      9: 9,
    },
  ])
})
