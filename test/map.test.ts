import { fromIterable } from '../src/fromIterable'
import { map } from '../src/map'
import { toArray } from '../src/toArray'

test('transforms values', async () => {
  expect(
    await toArray(
      fromIterable([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]).pipeThrough(
        map((chunk) => chunk + 1)
      )
    )
  ).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
})
