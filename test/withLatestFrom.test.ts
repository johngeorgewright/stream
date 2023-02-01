import { setTimeout } from 'node:timers/promises'
import { fromIterable } from '../src/sources/fromIterable'
import { map } from '../src/transformers/map'
import { withLatestFrom } from '../src/transformers/withLatestFrom'
import { write } from '../src/sinks/write'

test('combines each value from the source with the latest values from other inputs', async () => {
  const fn = jest.fn()

  await fromIterable(['a', 'b', 'c', 'd', 'e'])
    .pipeThrough(
      map(async (chunk) => (chunk === 'b' ? setTimeout(0, chunk) : chunk))
    )
    .pipeThrough(
      withLatestFrom(fromIterable([1, 2, 3, 4]), fromIterable(['x', 'y']))
    )
    .pipeTo(write(fn))

  expect(fn.mock.calls).toMatchInlineSnapshot(`
    [
      [
        [
          "a",
          1,
          "x",
        ],
      ],
      [
        [
          "b",
          4,
          "y",
        ],
      ],
      [
        [
          "c",
          4,
          "y",
        ],
      ],
      [
        [
          "d",
          4,
          "y",
        ],
      ],
      [
        [
          "e",
          4,
          "y",
        ],
      ],
    ]
  `)
})
