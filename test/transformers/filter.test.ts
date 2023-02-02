import { filter } from '../../src/transformers/filter'
import { fromIterable } from '../../src/sources/fromIterable'
import { toArray } from '../../src/sinks/toArray'

test('filters unwanted values', async () => {
  expect(
    await toArray(
      fromIterable([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]).pipeThrough(
        filter((x) => x % 2 === 0)
      )
    )
  ).toEqual([0, 2, 4, 6, 8])
})
