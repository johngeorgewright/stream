import { without } from '../src/index.js'

test('without', () => {
  expect(without([1, 2, 3, 4], 2)).toEqual([1, 3, 4])
  expect(without([1, 2, 3, 4], 5)).toEqual([1, 2, 3, 4])
  expect(without([1, 2, 1, 2], 1)).toEqual([2, 1, 2])
})
