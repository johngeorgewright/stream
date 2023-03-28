import { asyncIterableToArray, takeWhile } from '../../src/utils/index.js'

test('takeWhile', () => {
  expect([...takeWhile('aaabbbcccddd', (x) => x !== 'c')]).toEqual([
    'a',
    'a',
    'a',
    'b',
    'b',
    'b',
  ])
})

test('asyncIterableToArray', async () => {
  expect(await asyncIterableToArray(generate())).toEqual([1, 2, 3, 4])

  async function* generate() {
    yield 1
    yield 2
    yield 3
    yield 4
  }
})
