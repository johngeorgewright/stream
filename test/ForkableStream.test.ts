import { fromIterable } from '../src/fromIterable'
import { ForkableStream } from '../src/ForkableStream'
import { write } from '../src/write'

test('one subscription', async () => {
  const forkable = new ForkableStream()
  const fn = jest.fn()
  fromIterable([1, 2, 3, 4, 5]).pipeTo(forkable)
  await forkable.fork().pipeTo(write(fn))
  expect(fn).toHaveBeenCalledTimes(5)
})

test('multiple subscribers', async () => {
  const forkable = new ForkableStream()
  const fn = jest.fn()
  fromIterable([1, 2, 3, 4, 5]).pipeTo(forkable)
  await Promise.all([
    forkable.fork().pipeTo(write(fn)),
    forkable.fork().pipeTo(write(fn)),
    forkable.fork().pipeTo(write(fn)),
  ])
  expect(fn).toHaveBeenCalledTimes(15)
})
