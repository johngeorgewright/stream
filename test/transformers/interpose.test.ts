import { setImmediate } from 'node:timers/promises'
import { fromIterable, interpose, write } from '../../src'
import { defer } from '../util'

test('holds up a stream until a promise resolves', async () => {
  const fn = jest.fn()
  const { promise, resolve } = defer()
  fromIterable([1, 2, 3, 4, 5, 6])
    .pipeThrough(interpose(promise))
    .pipeTo(write(fn))
  await setImmediate()
  expect(fn).not.toHaveBeenCalled()
  resolve()
  await setImmediate()
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
  fromIterable([1, 2, 3, 4, 5, 6])
    .pipeThrough(interpose(() => promise))
    .pipeTo(write(fn))
  await setImmediate()
  expect(fn).not.toHaveBeenCalled()
  resolve()
  await setImmediate()
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
    fromIterable([1, 2, 3, 4, 5, 6])
      .pipeThrough(interpose(promise))
      .pipeTo(write(fn))
  ).rejects.toThrow('foo')
})
