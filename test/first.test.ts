import { first } from '../src/first'
import { fromArray } from '../src/fromArray'

test('gets only the first chunk', async () => {
  expect(await first(fromArray([1, 2, 3, 4]))).toBe(1)
})
