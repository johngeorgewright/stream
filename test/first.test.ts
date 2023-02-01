import { first } from '../src/transformers/first'
import { fromIterable } from '../src/sources/fromIterable'
import { toArray } from '../src/sinks/toArray'

test('gets only the first chunk', async () => {
  expect(
    await toArray(fromIterable([1, 2, 3, 4]).pipeThrough(first()))
  ).toEqual([1])
})
