import { find } from '../src/find'
import { fromArray } from '../src/fromArray'
import { toArray } from '../src/toArray'

test('queues the first found chunk and then terminates the stream', async () => {
  expect(
    await toArray(
      fromArray([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]).pipeThrough(
        find((chunk) => chunk === 4)
      )
    )
  ).toEqual([4])
})
