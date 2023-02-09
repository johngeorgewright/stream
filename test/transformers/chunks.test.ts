import { chunks } from '../../src/transformers/chunks'
import { fromIterable } from '../../src/sources/fromIterable'
import { write } from '../../src/sinks/write'

test('chunks in 2s', async () => {
  const fn = jest.fn()
  await fromIterable([1, 2, 3, 4, 5, 6, 7, 8])
    .pipeThrough(chunks(2))
    .pipeTo(write(fn))
  expect(fn.mock.calls).toMatchInlineSnapshot(`
    [
      [
        [
          1,
          2,
        ],
      ],
      [
        [
          3,
          4,
        ],
      ],
      [
        [
          5,
          6,
        ],
      ],
      [
        [
          7,
          8,
        ],
      ],
    ]
  `)
})

test('queues whatever remains after stream has closed', async () => {
  const fn = jest.fn()
  await fromIterable([1, 2, 3, 4, 5, 6, 7, 8])
    .pipeThrough(chunks(5))
    .pipeTo(write(fn))
  expect(fn.mock.calls).toMatchInlineSnapshot(`
    [
      [
        [
          1,
          2,
          3,
          4,
          5,
        ],
      ],
      [
        [
          6,
          7,
          8,
        ],
      ],
    ]
  `)
})
