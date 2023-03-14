import { ForkableReplayStream, fromCollection, write } from '../../src/index.js'

test('subscribing will replay all previously emitted values', async () => {
  const forkable = new ForkableReplayStream()
  const fn1 = jest.fn()
  const fn2 = jest.fn()
  fromCollection([1, 2, 3, 4, 5]).pipeTo(forkable)
  await forkable.fork().pipeTo(write(fn1))
  await forkable.fork().pipeTo(write(fn2))
  expect(fn1).toHaveBeenCalledTimes(5)
  expect(fn2).toHaveBeenCalledTimes(5)
})

test('max size', async () => {
  const forkable = new ForkableReplayStream(2)
  const fn = jest.fn()
  await fromCollection([1, 2, 3, 4, 5]).pipeTo(forkable)
  await forkable.fork().pipeTo(write(fn))
  expect(fn.mock.calls).toMatchInlineSnapshot(`
    [
      [
        4,
      ],
      [
        5,
      ],
    ]
  `)
})

test('clearing', async () => {
  const forkable = new ForkableReplayStream()
  const fn = jest.fn()
  await fromCollection([1, 2, 3, 4, 5]).pipeTo(forkable)
  forkable.clear()
  await forkable.fork().pipeTo(write(fn))
  expect(fn).toHaveBeenCalledTimes(0)
})
