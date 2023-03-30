import { fromTimeline, merge, write } from '../../src/index.js'

test('numbers', async () => {
  const fn = jest.fn()

  await fromTimeline(`
    --1--2--3--4--5--6--|
  `).pipeTo(write(fn))

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

test('strings', async () => {
  const fn = jest.fn()

  await fromTimeline(`
    --one--two--three-four--|
  `).pipeTo(write(fn))

  expect(fn.mock.calls).toMatchInlineSnapshot(`
    [
      [
        "one",
      ],
      [
        "two",
      ],
      [
        "three",
      ],
      [
        "four",
      ],
    ]
  `)
})

test('objects', async () => {
  const fn = jest.fn()

  await fromTimeline(`
    --{foo:bar,a:b}--{ one: 1, two: 2 }--|
  `).pipeTo(write(fn))

  expect(fn.mock.calls).toMatchInlineSnapshot(`
    [
      [
        {
          "a:b": null,
          "foo:bar": null,
        },
      ],
      [
        {
          "one": 1,
          "two": 2,
        },
      ],
    ]
  `)
})

test('arrays', async () => {
  const fn = jest.fn()

  await fromTimeline(`
    --[1,one, 3,  4]--|
  `).pipeTo(write(fn))

  expect(fn.mock.calls).toMatchInlineSnapshot(`
    [
      [
        [
          1,
          "one",
          3,
          4,
        ],
      ],
    ]
  `)
})

test('booleans', async () => {
  const fn = jest.fn()

  await fromTimeline(`--true--false--|`).pipeTo(write(fn))

  expect(fn.mock.calls).toMatchInlineSnapshot(`
    [
      [
        true,
      ],
      [
        false,
      ],
    ]
  `)
})

test('errors', async () => {
  const fn = jest.fn()

  await expect(
    fromTimeline(`--1--2--E--3--`).pipeTo(write(fn))
  ).rejects.toThrow()

  expect(fn.mock.calls).toMatchInlineSnapshot(`
    [
      [
        1,
      ],
      [
        2,
      ],
    ]
  `)
})

test('timeline', async () => {
  const fn = jest.fn()

  await merge([
    fromTimeline('--1--2--3--4--|'),
    fromTimeline('-a----b-c-d---|'),
  ]).pipeTo(write(fn))

  expect(fn.mock.calls).toMatchInlineSnapshot(`
    [
      [
        "a",
      ],
      [
        1,
      ],
      [
        2,
      ],
      [
        "b",
      ],
      [
        3,
      ],
      [
        "c",
      ],
      [
        "d",
      ],
      [
        4,
      ],
    ]
  `)
})
