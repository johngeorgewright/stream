import { fromIterable, toArray } from '../../src'

test('iterables', async () => {
  expect(await toArray(fromIterable([0, 1, 2]))).toEqual([0, 1, 2])
})

test('iterators', async () => {
  let i = 0
  const iterator: Iterator<number> = {
    next: () =>
      i > 2 ? { done: true, value: undefined } : { done: false, value: i++ },
  }

  expect(await toArray(fromIterable(iterator))).toEqual([0, 1, 2])
})

test('async iterables', async () => {
  expect(
    await toArray(
      fromIterable(
        (async function* () {
          yield 0
          yield 1
          yield 2
        })()
      )
    )
  ).toEqual([0, 1, 2])
})

test('async iterators', async () => {
  let i = 0
  const iterator: AsyncIterator<number> = {
    next: async () =>
      i > 2 ? { done: true, value: undefined } : { done: false, value: i++ },
  }

  expect(await toArray(fromIterable(iterator))).toEqual([0, 1, 2])
})

test('array likes', async () => {
  expect(
    await toArray(
      fromIterable({
        0: 'zero',
        1: 'one',
        2: 'two',
        length: 3,
      })
    )
  ).toEqual(['zero', 'one', 'two'])
})

test('errors', async () => {
  let aborted = false
  await expect(
    fromIterable({
      next() {
        throw new Error('Foo')
      },
    }).pipeTo(
      new WritableStream({
        abort(reason) {
          expect(reason).toHaveProperty('message', 'Foo')
          aborted = true
        },
      })
    )
  ).rejects.toThrow('Foo')
  expect(aborted).toBe(true)
})
