import {
  some,
  fromCollection,
  toArray,
  ControllableStream,
  write,
} from '../../src/index.js'
import { timeout } from '../util.js'

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
