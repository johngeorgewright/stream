import { setImmediate, setTimeout } from 'node:timers/promises'
import { ControllableStream } from '../src/ControllableStream'
import { debounce } from '../src/debounce'
import { write } from '../src/write'

let controller: ControllableStream<number>
let fn: jest.Mock<void, [number]>

beforeEach(() => {
  controller = new ControllableStream()
  fn = jest.fn()
})

afterEach(() => {
  controller.close()
})

test('trailing only (by default)', async () => {
  controller.pipeThrough(debounce(10)).pipeTo(write(fn))

  controller.enqueue(1)
  controller.enqueue(2)
  await setImmediate()
  expect(fn).not.toHaveBeenCalled()

  await setTimeout(15)
  expect(fn).toHaveBeenCalledTimes(1)
  expect(fn).toHaveBeenCalledWith(2)
})

test('leading only', async () => {
  controller.pipeThrough(debounce(10, { leading: true })).pipeTo(write(fn))

  controller.enqueue(1)
  controller.enqueue(2)
  await setImmediate()
  expect(fn).toHaveBeenCalledTimes(1)
  expect(fn).toHaveBeenCalledWith(1)

  await setTimeout(15)
  expect(fn).toHaveBeenCalledTimes(1)
})

test('leading and trailing', async () => {
  controller
    .pipeThrough(debounce(10, { leading: true, trailing: true }))
    .pipeTo(write(fn))

  controller.enqueue(1)
  controller.enqueue(2)
  controller.enqueue(3)
  await setImmediate()
  expect(fn).toHaveBeenCalledTimes(1)
  expect(fn).toHaveBeenCalledWith(1)

  await setTimeout(15)
  expect(fn).toHaveBeenCalledTimes(2)
  expect(fn).toHaveBeenCalledWith(3)
})
