import { ControllableStream, distinct, fromIterable, write } from '../../src'

test('only emits distinct values', async () => {
  const fn = jest.fn()
  await fromIterable([1, 1, 2, 2, 2, 1, 2, 3, 4, 3, 2, 1])
    .pipeThrough(distinct())
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

test('selecting a distinct key', async () => {
  const fn = jest.fn()
  await fromIterable([
    { a: 4, n: 'f' },
    { a: 7, n: 'b' },
    { a: 5, n: 'f' },
  ])
    .pipeThrough(distinct({ selector: (x) => x.n }))
    .pipeTo(write(fn))
  expect(fn.mock.calls).toMatchInlineSnapshot(`
    [
      [
        {
          "a": 4,
          "n": "f",
        },
      ],
      [
        {
          "a": 7,
          "n": "b",
        },
      ],
    ]
  `)
})

test('flushing with a stream', async () => {
  const fn = jest.fn()
  const flushes = new ControllableStream<null>()
  let i = 0
  await new ReadableStream<number>({
    pull(controller) {
      i++
      if (i === 3) flushes.enqueue(null)
      else if (i === 6) return controller.close()
      controller.enqueue(1)
    },
  })
    .pipeThrough(distinct({ flushes }))
    .pipeTo(write(fn))
  expect(fn.mock.calls).toMatchInlineSnapshot(`
    [
      [
        1,
      ],
      [
        1,
      ],
    ]
  `)
})
