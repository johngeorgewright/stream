import { fromCollection, toIterable } from '../../src'

test('turns a stream in to an async iterator', async () => {
  const array: number[] = []
  for await (const item of toIterable(fromCollection([1, 2, 3, 4, 5])))
    array.push(item)
  expect(array).toEqual([1, 2, 3, 4, 5])
})
