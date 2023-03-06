import { fromCollection, label, write } from '../../src'

test('using a property', async () => {
  const fn = jest.fn()
  await fromCollection(['one', 'two', 'three'])
    .pipeThrough(label('length'))
    .pipeTo(write(fn))
  expect(fn.mock.calls).toMatchInlineSnapshot(`
    [
      [
        {
          "label": 3,
          "value": "one",
        },
      ],
      [
        {
          "label": 3,
          "value": "two",
        },
      ],
      [
        {
          "label": 5,
          "value": "three",
        },
      ],
    ]
  `)
})

test('using a function', async () => {
  const fn = jest.fn()
  await fromCollection([6.1, 4.2, 6.3])
    .pipeThrough(label(Math.floor))
    .pipeTo(write(fn))
  expect(fn.mock.calls).toMatchInlineSnapshot(`
    [
      [
        {
          "label": 6,
          "value": 6.1,
        },
      ],
      [
        {
          "label": 4,
          "value": 4.2,
        },
      ],
      [
        {
          "label": 6,
          "value": 6.3,
        },
      ],
    ]
  `)
})
