import { flat } from '../../src/transformers/flat'
import { fromIterable } from '../../src/sources/fromIterable'
import { setTimeout } from 'timers/promises'
import { write } from '../../src/sinks/write'

beforeEach(() => {
  for (let i = 0; i < 3; i++) {
    const p = document.createElement('p')
    p.id = i.toString()
    document.documentElement.appendChild(p)
  }
})

afterEach(() => {
  Array.from(document.querySelectorAll('p')).forEach((p) => p.remove())
})

test('flattens iterables', async () => {
  const fn = jest.fn()
  await fromIterable([
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
  await fromIterable([
    (async function* () {
      yield 1
      await setTimeout(1)
      yield 2
    })(),
    (async function* () {
      yield 3
      await setTimeout(1)
      yield (async function* () {
        await setTimeout(1)
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
  await fromIterable(document.querySelectorAll('p'))
    .pipeThrough(flat())
    .pipeTo(write(fn))
  expect(fn.mock.calls).toMatchInlineSnapshot(`
    [
      [
        <p
          id="0"
        />,
      ],
      [
        <p
          id="1"
        />,
      ],
      [
        <p
          id="2"
        />,
      ],
    ]
  `)
})

test('flattens a mixture of all iterables things', async () => {
  const fn = jest.fn()
  await fromIterable([
    [
      (async function* () {
        yield 1
        await setTimeout(1)
        yield [2, 3]
      })(),
      (async function* () {
        yield [document.querySelectorAll('p')]
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
        <p
          id="0"
        />,
      ],
      [
        <p
          id="1"
        />,
      ],
      [
        <p
          id="2"
        />,
      ],
    ]
  `)
})
