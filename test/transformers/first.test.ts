import { first, fromCollection, toArray } from '../../src/index.js'

test('gets only the first chunk', async () => {
  expect(
    await toArray(fromCollection([1, 2, 3, 4]).pipeThrough(first()))
  ).toEqual([1])
})
