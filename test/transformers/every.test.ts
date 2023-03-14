import { every, fromCollection, toArray } from '../../src/index.js'

test('when not', async () => {
  expect(
    await toArray(
      fromCollection([5, 10, 15, 18, 20]).pipeThrough(
        every((chunk) => chunk % 5 === 0)
      )
    )
  ).toEqual([false])
})

test('when true', async () => {
  expect(
    await toArray(
      fromCollection([5, 10, 15, 20]).pipeThrough(
        every((chunk) => chunk % 5 === 0)
      )
    )
  ).toEqual([true])
})
