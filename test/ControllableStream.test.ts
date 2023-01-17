import { consume } from '../src/consume'
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
