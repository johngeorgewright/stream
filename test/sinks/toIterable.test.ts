import { fromCollection, toIterable } from '../../src'

test('turns a stream in to an async iterable', async () => {
  const array: number[] = []
  for await (const item of toIterable(fromCollection([1, 2, 3, 4, 5])))
    array.push(item)
  expect(array).toEqual([1, 2, 3, 4, 5])
})

test('cancels the stream when an error occurs in the iterable', async () => {
  await expect(async () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    for await (const _item of toIterable(
      new ReadableStream({
        start(controller) {
          controller.error(new Error('foo'))
        },
      })
    )) {
      //
    }
  }).rejects.toThrow('foo')
})
