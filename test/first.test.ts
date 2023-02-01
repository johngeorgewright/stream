import { first } from '../src/first'
import { fromIterable } from '../src/fromIterable'
import { toArray } from '../src/toArray'

test('gets only the first chunk', async () => {
  expect(
    await toArray(fromIterable([1, 2, 3, 4]).pipeThrough(first()))
  ).toEqual([1])
})
