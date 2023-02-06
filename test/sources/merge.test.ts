import { setTimeout } from 'node:timers/promises'
import { fromIterable } from '../../src/sources/fromIterable'
import { merge } from '../../src/sources/merge'
import { toArray } from '../../src/sinks/toArray'

test('successfully merge all streams', async () => {
  expect(
    await toArray(
      merge(
        fromIterable([1, 2, 3]),
        fromIterable([1, 2, 3]),
        fromIterable([4, 5, 6])
      )
    )
  ).toEqual([1, 1, 4, 2, 2, 5, 3, 3, 6])
})

test('aborted merged streams', () => {
  const abortController = new AbortController()
  abortController.abort()
  return expect(
    toArray(
      merge(
        fromIterable([1, 2, 3]),
        fromIterable([1, 2, 3]),
        fromIterable([4, 5, 6])
      ),
      { signal: abortController.signal }
    )
  ).rejects.toThrow()
})

test('merge streams of different lengths', async () => {
  expect(
    await toArray(
      merge<number | string>(
        fromIterable([1]),
        fromIterable(['a', 'b']),
        fromIterable(['!', '@', '#'])
      )
    )
  ).toEqual([1, 'a', '!', 'b', '@', '#'])
})

test('asynchronous streams', async () => {
  expect(
    await toArray(
      merge<number | string>(
        fromIterable(
          (async function* () {
            yield 1
          })()
        ),
        fromIterable(
          (async function* () {
            yield await setTimeout(10, 'a')
            yield await setTimeout(10, 'b')
          })()
        ),
        fromIterable(
          (async function* () {
            yield await setTimeout(20, '!')
            yield await setTimeout(20, '@')
            yield await setTimeout(20, '#')
          })()
        )
      )
    )
  ).toEqual([1, 'a', '!', 'b', '@', '#'])
})
