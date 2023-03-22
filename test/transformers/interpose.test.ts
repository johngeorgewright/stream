import { fromCollection, interpose, write } from '../../src/index.js'
import { timeout } from '../../src/utils/index.js'
import { defer } from '../util.js'

test('holds up a stream until a promise resolves', async () => {
  const fn = jest.fn()
  const { promise, resolve } = defer()
  fromCollection([1, 2, 3, 4, 5, 6])
    .pipeThrough(interpose(promise))
    .pipeTo(write(fn))
  await timeout()
  expect(fn).not.toHaveBeenCalled()
  resolve()
  await timeout()
  expect(fn.mock.calls).toMatchInlineSnapshot(`
    [
      [
        1,
      ],
      [
        2,
      ],
      [
        3,
      ],
      [
        4,
      ],
      [
        5,
      ],
      [
        6,
      ],
    ]
  `)
})

test("holds up a stream until a function's returned promise resolves", async () => {
  const fn = jest.fn()
  const { promise, resolve } = defer()
  fromCollection([1, 2, 3, 4, 5, 6])
    .pipeThrough(interpose(() => promise))
    .pipeTo(write(fn))
  await timeout()
  expect(fn).not.toHaveBeenCalled()
  resolve()
  await timeout()
  expect(fn.mock.calls).toMatchInlineSnapshot(`
    [
      [
        1,
      ],
      [
        2,
      ],
      [
        3,
      ],
      [
        4,
      ],
      [
        5,
      ],
      [
        6,
      ],
    ]
  `)
})

test('errored promises will error downstream', async () => {
  const fn = jest.fn()
  const promise = Promise.reject(new Error('foo'))
  await expect(
    fromCollection([1, 2, 3, 4, 5, 6])
      .pipeThrough(interpose(promise))
      .pipeTo(write(fn))
  ).rejects.toThrow('foo')
})
