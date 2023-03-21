import { race, write } from '../../src/index.js'
import { timeout } from '../../src/utils/Async.js'

test('mirrors the first source stream to queue an item', async () => {
  const stream1 = new ReadableStream<number>({
    async start(controller) {
      await timeout(1_000)
      controller.enqueue(1)
      controller.close()
    },
  })
  const stream2 = new ReadableStream<number>({
    async start(controller) {
      await timeout(10)
      controller.enqueue(2)
      controller.close()
    },
  })
  const fn = jest.fn()
  await race([stream1, stream2]).pipeTo(write(fn))
  expect(fn.mock.calls).toMatchInlineSnapshot(`
    [
      [
        2,
      ],
    ]
  `)
})

test('immediately closes if there are 0 streams', async () => {
  const fn = jest.fn()
  await race([]).pipeTo(write(fn))
  expect(fn).not.toHaveBeenCalled()
})

test('receives an error from the first stream that errors', async () => {
  const stream1 = new ReadableStream<number>({
    async start(controller) {
      await timeout(50)
      controller.error(new Error('foo'))
    },
  })
  const stream2 = new ReadableStream<number>({
    async start(controller) {
      await timeout(10)
      controller.enqueue(2)
      await timeout(50)
      controller.enqueue(3)
    },
  })
  await expect(race([stream1, stream2]).pipeTo(write())).rejects.toThrow('foo')
})

test('cancels upstream when aborted', async () => {
  let cancelled = false
  const stream1 = new ReadableStream<number>({
    cancel() {
      cancelled = true
    },
  })
  await expect(
    race([stream1]).pipeTo(write(), { signal: AbortSignal.abort() })
  ).rejects.toThrow()
  expect(cancelled).toBe(true)
})
