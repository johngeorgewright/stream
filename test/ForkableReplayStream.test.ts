import { fromIterable } from '../src/fromIterable'
import { ForkableReplayStream } from '../src/ForkableReplayStream'
import { write } from '../src/write'

test('subscribing will replay all previously emitted values', async () => {
  const forkable = new ForkableReplayStream()
  const fn1 = jest.fn()
  const fn2 = jest.fn()
  fromIterable([1, 2, 3, 4, 5]).pipeTo(forkable)
  await forkable.fork().pipeTo(write(fn1))
  await forkable.fork().pipeTo(write(fn2))
  expect(fn1).toHaveBeenCalledTimes(5)
  expect(fn2).toHaveBeenCalledTimes(5)
})
