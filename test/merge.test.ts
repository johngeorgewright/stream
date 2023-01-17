import { fromArray } from '../src/fromArray'
import { merge } from '../src/merge'
import { toArray } from '../src/toArray'

test('successfully merge all streams', async () => {
  expect(
    await toArray(
      merge([fromArray([1, 2, 3]), fromArray([1, 2, 3]), fromArray([4, 5, 6])])
    )
  ).toEqual([1, 1, 4, 2, 2, 5, 3, 3, 6])
})

test('aborted merged streams', () => {
  const abortController = new AbortController()
  abortController.abort()
  return expect(
    toArray(
      merge([fromArray([1, 2, 3]), fromArray([1, 2, 3]), fromArray([4, 5, 6])]),
      { signal: abortController.signal }
    )
  ).rejects.toThrow()
})
