import { after, fromCollection, write } from '../../src/index.js'

test('prevents chunks until predicate', async () => {
  const fn = jest.fn()
  await fromCollection([0, 1, 2, 3, 4, 5, 6, 1, 2, 3, 4])
    .pipeThrough(after((x) => x > 4))
    .pipeTo(write(fn))
  expect(fn.mock.calls).toMatchInlineSnapshot(`
    [
      [
        5,
      ],
      [
        6,
      ],
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
