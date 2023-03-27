import {
  asyncIterableToArray,
  parseTimelineValues,
} from '../../src/utils/index.js'

test('parseTimelineValues', async () => {
  expect(
    await asyncIterableToArray(
      parseTimelineValues('--1--{foo:bar}--[a,b]--true--E--|')
    )
  ).toMatchInlineSnapshot(`
    [
      1,
      {
        "foo": "bar",
      },
      [
        "a",
        "b",
      ],
      true,
      [Error],
      [Error: The stream will now close],
    ]
  `)
})
