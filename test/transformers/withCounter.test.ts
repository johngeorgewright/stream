import { fromCollection, withCounter, write } from '../../src/index.js'

test('Adds a counter representing the amount of chunks received thus far', async () => {
  const fn = jest.fn()
  await fromCollection(['a', 'b', 'c'])
    .pipeThrough(withCounter())
    .pipeTo(write(fn))
  expect(fn.mock.calls).toMatchInlineSnapshot(`
    [
      [
        {
          "chunk": "a",
          "counter": 0,
        },
      ],
      [
        {
          "chunk": "b",
          "counter": 1,
        },
      ],
      [
        {
          "chunk": "c",
          "counter": 2,
        },
      ],
    ]
  `)
})

test('Can change the starting number', async () => {
  const fn = jest.fn()
  await fromCollection(['a', 'b', 'c'])
    .pipeThrough(withCounter(1))
    .pipeTo(write(fn))
  expect(fn.mock.calls).toMatchInlineSnapshot(`
    [
      [
        {
          "chunk": "a",
          "counter": 1,
        },
      ],
      [
        {
          "chunk": "b",
          "counter": 2,
        },
      ],
      [
        {
          "chunk": "c",
          "counter": 3,
        },
      ],
    ]
  `)
})
