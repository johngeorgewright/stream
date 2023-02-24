import { some, fromIterable, toArray } from '../../src'

test('when not', async () => {
  expect(
    await toArray(
      fromIterable([6, 11, 12, 18, 27]).pipeThrough(
        some((chunk) => chunk % 5 === 0)
      )
    )
  ).toEqual([false])
})

test('when true', async () => {
  expect(
    await toArray(
      fromIterable([5, 11, 12, 18, 27]).pipeThrough(
        some((chunk) => chunk % 5 !== 0)
      )
    )
  ).toEqual([true])
})
