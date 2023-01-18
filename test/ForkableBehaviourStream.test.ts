import { ForkableBehaviorStream } from '../src/ForkableBehaviorStream'
import { fromArray } from '../src/fromArray'
import { write } from '../src/write'

test('subscribing will always provide that last chunk', async () => {
  const forkable = new ForkableBehaviorStream()
  fromArray([1, 2, 3, 4, 5]).pipeTo(forkable)
  const fn1 = jest.fn()
  const fn2 = jest.fn()
  await forkable.fork().pipeTo(write(fn1))
  await forkable.fork().pipeTo(write(fn2))
  expect(fn1).toHaveBeenCalledTimes(5)
  expect(fn2).toHaveBeenCalledTimes(1)
  expect(fn2).toHaveBeenCalledWith(5)
})
