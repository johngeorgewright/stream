import { setTimeout } from 'node:timers/promises'
import { roundRobin, toArray, write } from '../../src'

const randomlyDelayedStream = <T>(items: T[]) =>
  new ReadableStream({
    async pull(controller) {
      if (!items.length) return controller.close()
      await setTimeout(Math.random())
      controller.enqueue(items.shift())
    },
  })

test('it pulls, in order, from one stream at a time', async () => {
  expect(
    await toArray(
      roundRobin([
        randomlyDelayedStream([1, 2, 3]),
        randomlyDelayedStream(['one', 'two', 'three']),
      ])
    )
  ).toEqual([1, 'one', 2, 'two', 3, 'three'])
})

test('streams that close before others will be removed from the round robin', async () => {
  expect(
    await toArray(
      roundRobin([
        randomlyDelayedStream([1]),
        randomlyDelayedStream(['one', 'two', 'three']),
      ])
    )
  ).toEqual([1, 'one', 'two', 'three'])
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

  const three = roundRobin([one, two])
  const reader = three.getReader()
  await reader.cancel('foobar')

  expect(oneCancel).toHaveBeenCalledWith('foobar')
  expect(twoCancel).toHaveBeenCalledWith('foobar')
})

test('immediately closes with no streams to merge', async () => {
  const fn = jest.fn()
  await roundRobin([]).pipeTo(write())
  expect(fn).not.toHaveBeenCalled()
})
