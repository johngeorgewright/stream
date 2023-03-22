import {
  some,
  fromCollection,
  toArray,
  ControllableStream,
  write,
} from '../../src/index.js'
import { timeout } from '../../src/utils/Async.js'

test('when not', async () => {
  expect(
    await toArray(
      fromCollection([6, 11, 12, 18, 27]).pipeThrough(
        some((chunk) => chunk % 5 === 0)
      )
    )
  ).toEqual([false])
})

test('when true', async () => {
  expect(
    await toArray(
      fromCollection([5, 11, 12, 18, 27]).pipeThrough(
        some((chunk) => chunk % 5 !== 0)
      )
    )
  ).toEqual([true])
})

test('flushing', async () => {
  const flushes = new ControllableStream<null>()
  const fn = jest.fn<void, [boolean]>()
  await new ReadableStream<number>({
    async start(controller) {
      controller.enqueue(6)
      controller.enqueue(11)
      await timeout()
      flushes.enqueue(null)
      await timeout()
      controller.enqueue(20)
    },
  })
    .pipeThrough(some((chunk) => chunk % 5 === 0, { flushes }))
    .pipeTo(write(fn))
  expect(fn.mock.calls).toMatchInlineSnapshot(`
    [
      [
        false,
      ],
      [
        true,
      ],
    ]
  `)
})

test('allow flush errors to be sent down stream', async () => {
  const flushes = new ControllableStream<null>()
  await expect(
    new ReadableStream<number>({
      pull() {
        flushes.error(new Error('foo'))
      },
    })
      .pipeThrough(some(() => false, { flushes }))
      .pipeTo(write())
  ).rejects.toThrow('foo')
})

test('disallow flush errors to be sent down stream', async () => {
  const fn = jest.fn()
  let i = 0
  const flushes = new ControllableStream<null>()
  await new ReadableStream<number>({
    pull(controller) {
      i++
      if (i === 3) flushes.error(new Error('foo'))
      else if (i === 6) return controller.close()
      controller.enqueue(1)
    },
  })
    .pipeThrough(some(() => false, { flushes, ignoreFlushErrors: true }))
    .pipeTo(write(fn))
  expect(fn.mock.calls).toMatchInlineSnapshot(`
    [
      [
        false,
      ],
    ]
  `)
})
