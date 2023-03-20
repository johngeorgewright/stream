import {
  ControllableStream,
  fromCollection,
  reduce,
  toArray,
  write,
} from '../../src/index.js'
import { timeout } from '../util.js'

test('accumulates values from a stream', async () => {
  expect(
    await toArray(
      fromCollection([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]).pipeThrough(
        reduce({} as Record<string, number>, (acc, chunk) => ({
          ...acc,
          [chunk.toString()]: chunk,
        }))
      )
    )
  ).toEqual([
    {
      0: 0,
      1: 1,
      2: 2,
      3: 3,
      4: 4,
      5: 5,
      6: 6,
      7: 7,
      8: 8,
      9: 9,
    },
  ])
})

test('flushing', async () => {
  const fn = jest.fn<void, [Record<string, number>]>()
  const flushes = new ControllableStream<null>()
  await new ReadableStream<number>({
    async start(controller) {
      controller.enqueue(0)
      controller.enqueue(1)
      controller.enqueue(2)
      controller.enqueue(3)
      await timeout()
      flushes.enqueue(null)
      await timeout()
      controller.enqueue(4)
      controller.enqueue(5)
      controller.close()
    },
  })
    .pipeThrough(
      reduce(
        {} as Record<string, number>,
        (acc, chunk) => ({
          ...acc,
          [chunk.toString()]: chunk,
        }),
        { flushes }
      )
    )
    .pipeTo(write(fn))
  expect(fn.mock.calls).toMatchInlineSnapshot(`
    [
      [
        {
          "0": 0,
          "1": 1,
          "2": 2,
          "3": 3,
        },
      ],
      [
        {
          "0": 0,
          "1": 1,
          "2": 2,
          "3": 3,
          "4": 4,
          "5": 5,
        },
      ],
    ]
  `)
})
