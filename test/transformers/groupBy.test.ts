import { fromIterable, groupBy, write } from '../../src'

test('using a property', async () => {
  const fn = jest.fn()
  await fromIterable(['one', 'two', 'three'])
    .pipeThrough(groupBy('length'))
    .pipeTo(write(fn))
  expect(fn.mock.calls).toMatchInlineSnapshot(`
    [
      [
        {
          "3": [
            "one",
          ],
        },
      ],
      [
        {
          "3": [
            "one",
            "two",
          ],
        },
      ],
      [
        {
          "3": [
            "one",
            "two",
          ],
          "5": [
            "three",
          ],
        },
      ],
    ]
  `)
})

test('using a function', async () => {
  const fn = jest.fn()
  await fromIterable([6.1, 4.2, 6.3])
    .pipeThrough(groupBy(Math.floor))
    .pipeTo(write(fn))
  expect(fn.mock.calls).toMatchInlineSnapshot(`
    [
      [
        {
          "6": [
            6.1,
          ],
        },
      ],
      [
        {
          "4": [
            4.2,
          ],
          "6": [
            6.1,
          ],
        },
      ],
      [
        {
          "4": [
            4.2,
          ],
          "6": [
            6.1,
            6.3,
          ],
        },
      ],
    ]
  `)
})
