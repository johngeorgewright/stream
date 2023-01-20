import { fromIterable } from '../src/fromIterable'
import { ForkableStream } from '../src/ForkableStream'
import { write } from '../src/write'

let forkable: ForkableStream<number>
let fn: jest.Mock<void, [number]>
let readable: ReadableStream<number>

beforeEach(() => {
  forkable = new ForkableStream()
  fn = jest.fn()
  readable = fromIterable([1, 2, 3, 4, 5])
})

test('fork before piping', async () => {
  const promise = forkable.fork().pipeTo(write(fn))
  readable.pipeTo(forkable)
  await promise
  expect(fn).toHaveBeenCalledTimes(5)
})

test('fork after piping', async () => {
  readable.pipeTo(forkable)
  await forkable.fork().pipeTo(write(fn))
  expect(fn).toHaveBeenCalledTimes(5)
})

test('multiple subscribers', async () => {
  readable.pipeTo(forkable)
  await Promise.all([
    forkable.fork().pipeTo(write(fn)),
    forkable.fork().pipeTo(write(fn)),
    forkable.fork().pipeTo(write(fn)),
  ])
  expect(fn).toHaveBeenCalledTimes(15)
})
