import { expectTimeline, fromTimeline, merge } from '../../src/index.js'

test('expectTimeline', async () => {
  const fn = jest.fn()

  await merge([
    fromTimeline(`
      --1---2---3---4---5---
    `),
    fromTimeline(`
      ----a---b---c---d---e-
    `),
  ]).pipeTo(
    expectTimeline(
      `
      --1-a-2-b-3-c-4-d-5-e-
      `,
      fn
    )
  )

  expect(fn.mock.calls).toMatchInlineSnapshot(`
    [
      [
        1,
        1,
      ],
      [
        "a",
        "a",
      ],
      [
        2,
        2,
      ],
      [
        "b",
        "b",
      ],
      [
        3,
        3,
      ],
      [
        "c",
        "c",
      ],
      [
        4,
        4,
      ],
      [
        "d",
        "d",
      ],
      [
        5,
        5,
      ],
      [
        "e",
        "e",
      ],
    ]
  `)
})

test('objects and arrays', async () => {
  const fn = jest.fn()

  await fromTimeline(`
      --{foo:[bar]}--
    `).pipeTo(
    expectTimeline(
      `
      --{foo:[rab]}--
      `,
      fn
    )
  )

  expect(fn.mock.calls).toMatchInlineSnapshot(`
    [
      [
        {
          "foo": [
            "rab",
          ],
        },
        {
          "foo": [
            "bar",
          ],
        },
      ],
    ]
  `)
})

test('not enough chunks', async () => {
  const fn = jest.fn()

  await expect(
    fromTimeline(`
      --1--
    `).pipeTo(
      expectTimeline(
        `
      --1--2--{foo:bar}--
      `,
        fn
      )
    )
  ).rejects.toThrow(`There are 2 more expectations left.
[
  2,
  {
    "foo": "bar"
  }
]`)
})

test('not enough of a timeline', async () => {
  const fn = jest.fn()

  await expect(
    fromTimeline(`
    --1--2--3--
  `).pipeTo(
      expectTimeline(
        `
    --1--
  `,
        fn
      )
    )
  ).rejects.toThrow('Received more values than expected (at "2")')
})

test('errors in the timeline will error in the stream', async () => {
  const fn = jest.fn()

  await expect(
    fromTimeline(`
    --1--
  `).pipeTo(
      expectTimeline(
        `
    --E--
  `,
        fn
      )
    )
  ).rejects.toThrow()
})
