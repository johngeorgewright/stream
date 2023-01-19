import { fromIterable } from '../src/fromIterable'
import { toArray } from '../src/toArray'

test('consumes a stream in to an array of values', async () => {
  expect(await toArray(fromIterable([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]))).toEqual([
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
  ])
})
