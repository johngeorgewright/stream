import { setImmediate } from 'node:timers/promises'
import { buffer, ControllableStream, write } from '../../src'

let controller: ControllableStream<number>
let notifier: ControllableStream<null>
let fn: jest.Mock<void, [number[]]>

beforeEach(() => {
  controller = new ControllableStream<number>()
  notifier = new ControllableStream<null>()
  fn = jest.fn()

  controller.pipeThrough(buffer(notifier)).pipeTo(write(fn))
})

test('buffers the source stream chunks until `notifier` emits.', async () => {
  controller.enqueue(1)
  controller.enqueue(2)
  controller.enqueue(3)
  await setImmediate()
  expect(fn).not.toHaveBeenCalled()

  notifier.enqueue(null)
  await setImmediate()
  expect(fn).toHaveBeenCalledTimes(1)
  expect(fn).toHaveBeenCalledWith([1, 2, 3])

  controller.close()
})

test('flushes whatever is left over when the notifier closes', async () => {
  controller.enqueue(1)
  controller.enqueue(2)
  controller.enqueue(3)
  await setImmediate()

  notifier.close()
  await setImmediate()

  expect(fn).toHaveBeenCalledWith([1, 2, 3])
})

test('flusher whatever is left over when the stream closes', async () => {
  controller.enqueue(1)
  controller.enqueue(2)
  controller.enqueue(3)
  await setImmediate()

  controller.close()
  await setImmediate()

  expect(fn).toHaveBeenCalledWith([1, 2, 3])
})
