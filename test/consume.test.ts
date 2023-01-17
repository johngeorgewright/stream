import { fromArray } from '../src/fromArray'
import { write } from '../src/write'

test('consuming a string', async () => {
  const fn = jest.fn()
  await fromArray([1, 2, 3, 4, 5]).pipeTo(write(fn))
  expect(fn).toHaveBeenCalledTimes(5)
})
