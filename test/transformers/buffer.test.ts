import { buffer, ControllableStream, write } from '../../src/index.js'
import { timeout } from '../../src/utils/Async.js'

let controller: ControllableStream<number>
let notifier: ControllableStream<null>
let fn: jest.Mock<void, [number[]]>

beforeEach(() => {
  controller = new ControllableStream<number>()
  notifier = new ControllableStream<null>()
  fn = jest.fn()
})

test('buffers the source stream chunks until `notifier` emits.', async () => {
  controller.pipeThrough(buffer(notifier)).pipeTo(write(fn))
  controller.enqueue(1)
  controller.enqueue(2)
  controller.enqueue(3)
  await timeout()
  expect(fn).not.toHaveBeenCalled()

  notifier.enqueue(null)
  await timeout()
  expect(fn).toHaveBeenCalledTimes(1)
  expect(fn).toHaveBeenCalledWith([1, 2, 3])

  controller.close()
})

test('flushes whatever is left over when the notifier closes', async () => {
  controller.pipeThrough(buffer(notifier)).pipeTo(write(fn))
  controller.enqueue(1)
  controller.enqueue(2)
  controller.enqueue(3)
  await timeout()

  notifier.close()
  await timeout()

  expect(fn).toHaveBeenCalledWith([1, 2, 3])
})

test('flusher whatever is left over when the stream closes', async () => {
  controller.pipeThrough(buffer(notifier)).pipeTo(write(fn))
  controller.enqueue(1)
  controller.enqueue(2)
  controller.enqueue(3)
  await timeout()

  controller.close()
  await timeout()

  expect(fn).toHaveBeenCalledWith([1, 2, 3])
})

test('max buffer size', async () => {
  controller.pipeThrough(buffer(notifier, 2)).pipeTo(write(fn))
  controller.enqueue(1)
  controller.enqueue(2)
  controller.enqueue(3)
  controller.enqueue(4)
  await timeout()

  notifier.close()
  await timeout()

  expect(fn).toHaveBeenCalledWith([3, 4])
})
