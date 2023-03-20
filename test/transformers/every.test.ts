import {
  ControllableStream,
  every,
  fromCollection,
  toArray,
  write,
} from '../../src/index.js'
import { timeout } from '../util.js'

test('when not', async () => {
  expect(
    await toArray(
      fromCollection([5, 10, 15, 18, 20]).pipeThrough(
        every((chunk) => chunk % 5 === 0)
      )
    )
  ).toEqual([false])
})

test('when true', async () => {
  expect(
    await toArray(
      fromCollection([5, 10, 15, 20]).pipeThrough(
        every((chunk) => chunk % 5 === 0)
      )
    )
  ).toEqual([true])
})

test('flushing', async () => {
  const fn = jest.fn<void, [boolean]>()
  const flushes = new ControllableStream<null>()
  await new ReadableStream<number>({
    async start(controller) {
      controller.enqueue(5)
      controller.enqueue(10)
      controller.enqueue(15)
      controller.enqueue(20)
      await timeout()
      flushes.enqueue(null)
      await timeout()
      controller.enqueue(25)
      controller.close()
    },
  })
    .pipeThrough(every((chunk) => chunk % 5 === 0, { flushes }))
    .pipeTo(write(fn))
  expect(fn.mock.calls).toMatchInlineSnapshot(`
    [
      [
        true,
      ],
      [
        true,
      ],
    ]
  `)
})
