import { fromCollection, map, toArray } from '../../src'

test('transforms values', async () => {
  expect(
    await toArray(
      fromCollection([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]).pipeThrough(
        map((chunk) => chunk + 1)
      )
    )
  ).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
})
