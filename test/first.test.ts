import { first } from '../src/first'
import { fromIterable } from '../src/fromIterable'

test('gets only the first chunk', async () => {
  expect(await first(fromIterable([1, 2, 3, 4]))).toBe(1)
})
