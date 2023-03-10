import { setImmediate, setTimeout } from 'node:timers/promises'
import {
  ControllableStream,
  debounce,
  DebounceBackOffBehavior,
  DebounceLeadingBehavior,
  DebounceTrailingBehavior,
  write,
} from '../../src'

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
  controller
    .pipeThrough(debounce(10, new DebounceLeadingBehavior()))
    .pipeTo(write(fn))

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
    .pipeThrough(
      debounce(10, [
        new DebounceLeadingBehavior(),
        new DebounceTrailingBehavior(),
      ])
    )
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

test('back off', async () => {
  controller
    .pipeThrough(
      debounce(10, [
        new DebounceLeadingBehavior(),
        new DebounceBackOffBehavior({ inc: (x) => x * 2, max: 45 }),
      ])
    )
    .pipeTo(write(fn))

  controller.enqueue(1)
  controller.enqueue(2)
  await setTimeout(15)
  expect(fn).toHaveBeenCalledTimes(1)
  expect(fn).toHaveBeenCalledWith(1)

  await setTimeout(10)
  controller.enqueue(3)
  controller.enqueue(4)
  expect(fn).toHaveBeenCalledTimes(2)
  expect(fn).toHaveBeenCalledWith(3)
})
