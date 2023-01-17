import { consume } from '../src/consume'
import { map } from '../src/map'
import { ControllableStream } from '../src/ControllableStream'

test('gives ability to enqueue messages to a stream', async () => {
  const stream = new ControllableStream()
  const fn = jest.fn()
  stream.enqueue(1)
  stream.enqueue(2)
  const finished = consume(stream, fn)
  stream.enqueue(3)
  stream.enqueue(4)
  stream.close()
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
  const stream = controller.pipeThrough(map((x) => x + 1))
  const fn = jest.fn()
  controller.enqueue(1)
  controller.enqueue(2)
  controller.close()
  await consume(stream, fn)
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
