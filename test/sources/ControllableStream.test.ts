import { map } from '../../src/transformers/map'
import { ControllableStream } from '../../src/sources/ControllableStream'
import { write } from '../../src/sinks/write'

test('gives ability to enqueue messages to a stream', async () => {
  const controller = new ControllableStream<number>()
  const fn = jest.fn()
  controller.enqueue(1)
  controller.enqueue(2)
  const finished = controller.pipeTo(write(fn))
  controller.enqueue(3)
  controller.enqueue(4)
  controller.close()
  await finished
  expect(fn).toHaveBeenCalledTimes(4)
  expect(fn.mock.calls).toMatchInlineSnapshot(`
    [
      [
        1,
      ],
      [
        2,
      ],
      [
        3,
      ],
      [
        4,
      ],
    ]
  `)
})

test('piping', async () => {
  const controller = new ControllableStream<number>()
  const fn = jest.fn()
  controller.enqueue(1)
  controller.enqueue(2)
  controller.close()
  await controller.pipeThrough(map((x) => x + 1)).pipeTo(write(fn))
  expect(fn).toHaveBeenCalledTimes(2)
  expect(fn.mock.calls).toMatchInlineSnapshot(`
    [
      [
        2,
      ],
      [
        3,
      ],
    ]
  `)
})

test('pulling', async () => {
  const controller = new ControllableStream<number>()

  let i = -1
  controller.onPull(() => ++i)
  controller.onPull(() => ++i)
  controller.onPull(() => ++i)

  await expect(
    controller.pipeTo(
      new WritableStream({
        write(chunk, controller) {
          if (chunk === 3) controller.error(new Error('I have enough'))
        },
      })
    )
  ).rejects.toThrow('I have enough')

  // It will have already queued the 4th item before the 3rd errored
  expect(i).toBe(4)
})
