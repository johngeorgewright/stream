import { ControllableStream, distinct, fromCollection, write } from '../../src'

test('only emits distinct values', async () => {
  const fn = jest.fn()
  await fromCollection([1, 1, 2, 2, 2, 1, 2, 3, 4, 3, 2, 1])
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
  await fromCollection([
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

test('allow flush errors to be sent down stream', async () => {
  const flushes = new ControllableStream<null>()
  await expect(
    new ReadableStream<number>({
      pull() {
        flushes.error(new Error('foo'))
      },
    })
      .pipeThrough(distinct({ flushes }))
      .pipeTo(write())
  ).rejects.toThrow('foo')
})

test('disallow flush errors to be sent down stream', async () => {
  const fn = jest.fn()
  let i = 0
  const flushes = new ControllableStream<null>()
  await new ReadableStream<number>({
    pull(controller) {
      i++
      if (i === 3) flushes.error(new Error('foo'))
      else if (i === 6) return controller.close()
      controller.enqueue(1)
    },
  })
    .pipeThrough(distinct({ flushes, ignoreFlushErrors: true }))
    .pipeTo(write(fn))
  expect(fn.mock.calls).toMatchInlineSnapshot(`
    [
      [
        1,
      ],
    ]
  `)
})
