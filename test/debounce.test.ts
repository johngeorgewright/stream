import { setImmediate, setTimeout } from 'node:timers/promises'
import { ControllableStream } from '../src/ControllableStream'
import {
  BackOffBehavior,
  debounce,
  LeadingBehavior,
  TrailingBehavior,
} from '../src/debounce'
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
  controller.pipeThrough(debounce(10, new LeadingBehavior())).pipeTo(write(fn))

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
    .pipeThrough(debounce(10, [new LeadingBehavior(), new TrailingBehavior()]))
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
        new LeadingBehavior(),
        new BackOffBehavior({ inc: (x) => x * 2, max: 45 }),
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
