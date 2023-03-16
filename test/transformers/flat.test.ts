import { flat, fromCollection, write } from '../../src/index.js'
import { timeout } from '../util.js'

test('flattens iterables', async () => {
  const fn = jest.fn()
  await fromCollection([
    [1, 2],
    [3, [[4]]],
  ])
    .pipeThrough(flat())
    .pipeTo(write(fn))
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
    ]
  `)
})

test('flattens async iterables', async () => {
  const fn = jest.fn()
  await fromCollection([
    (async function* () {
      yield 1
      await timeout(1)
      yield 2
    })(),
    (async function* () {
      yield 3
      await timeout(1)
      yield (async function* () {
        await timeout(1)
        yield 4
      })()
    })(),
  ])
    .pipeThrough(flat())
    .pipeTo(write(fn))
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
    ]
  `)
})

test('flattens array likes', async () => {
  const fn = jest.fn()
  await fromCollection({ 0: 'zero', 1: 'one', 2: 'three', length: 3 })
    .pipeThrough(flat())
    .pipeTo(write(fn))
  expect(fn.mock.calls).toMatchInlineSnapshot(`
    [
      [
        "zero",
      ],
      [
        "one",
      ],
      [
        "three",
      ],
    ]
  `)
})

test('queues things that arent iterable', async () => {
  const fn = jest.fn()
  await new ReadableStream({
    start(controller) {
      controller.enqueue({ foo: 'bar' })
      controller.close()
    },
  })
    .pipeThrough(flat())
    .pipeTo(write(fn))
  expect(fn.mock.calls).toMatchInlineSnapshot(`
    [
      [
        {
          "foo": "bar",
        },
      ],
    ]
  `)
})

test('flattens a mixture of all iterables things', async () => {
  const fn = jest.fn()
  await fromCollection([
    [
      (async function* () {
        yield 1
        await timeout(1)
        yield [2, 3]
      })(),
      (async function* () {
        yield [{ 0: 'zero', length: 1 }]
      })(),
    ],
  ])
    .pipeThrough(flat())
    .pipeTo(write(fn))
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
        "zero",
      ],
    ]
  `)
})
