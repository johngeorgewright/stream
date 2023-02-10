import { first, fromIterable, toArray } from '../../src'

test('gets only the first chunk', async () => {
  expect(
    await toArray(fromIterable([1, 2, 3, 4]).pipeThrough(first()))
  ).toEqual([1])
})
