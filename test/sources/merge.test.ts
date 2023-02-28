import { setTimeout } from 'node:timers/promises'
import { fromIterable, merge, toArray, write } from '../../src'

test('successfully merge all streams', async () => {
  expect(
    await toArray(
      merge([
        fromIterable([1, 2, 3]),
        fromIterable([1, 2, 3]),
        fromIterable([4, 5, 6]),
      ])
    )
  ).toEqual([1, 1, 4, 2, 2, 5, 3, 3, 6])
})

test('aborted merged streams', () => {
  const abortController = new AbortController()
  abortController.abort()
  return expect(
    toArray(
      merge([
        fromIterable([1, 2, 3]),
        fromIterable([1, 2, 3]),
        fromIterable([4, 5, 6]),
      ]),
      { signal: abortController.signal }
    )
  ).rejects.toThrow()
})

test('cancelling the stream will cancel all upstreams', async () => {
  const oneCancel = jest.fn()
  const one = new ReadableStream({
    pull(controller) {
      controller.enqueue(1)
    },
    cancel: oneCancel,
  })

  const twoCancel = jest.fn()
  const two = new ReadableStream({
    pull(controller) {
      controller.enqueue(2)
    },
    cancel: twoCancel,
  })

  const three = merge([one, two])
  const reader = three.getReader()
  await reader.cancel('foobar')

  expect(oneCancel).toHaveBeenCalledWith('foobar')
  expect(twoCancel).toHaveBeenCalledWith('foobar')
})

test('merge streams of different lengths', async () => {
  expect(
    await toArray(
      merge([
        fromIterable([1]),
        fromIterable(['a', 'b']),
        fromIterable(['!', '@', '#']),
      ])
    )
  ).toEqual([1, 'a', '!', 'b', '@', '#'])
})

test('asynchronous streams', async () => {
  expect(
    await toArray(
      merge([
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
        ),
      ])
    )
  ).toEqual([1, 'a', '!', 'b', '@', '#'])
})

test('merging no streams closes the stream immediately', async () => {
  const fn = jest.fn()
  await merge([]).pipeTo(write(fn))
  expect(fn).not.toHaveBeenCalled()
})
