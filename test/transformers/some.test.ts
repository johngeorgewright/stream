import { some, fromCollection, toArray } from '../../src/index.js'

test('when not', async () => {
  expect(
    await toArray(
      fromCollection([6, 11, 12, 18, 27]).pipeThrough(
        some((chunk) => chunk % 5 === 0)
      )
    )
  ).toEqual([false])
})

test('when true', async () => {
  expect(
    await toArray(
      fromCollection([5, 11, 12, 18, 27]).pipeThrough(
        some((chunk) => chunk % 5 !== 0)
      )
    )
  ).toEqual([true])
})
