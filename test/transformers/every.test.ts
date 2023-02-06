import { every } from '../../src/transformers/every'
import { fromIterable } from '../../src/sources/fromIterable'
import { toArray } from '../../src/sinks/toArray'

test('when not', async () => {
  expect(
    await toArray(
      fromIterable([5, 10, 15, 18, 20]).pipeThrough(
        every((chunk) => chunk % 5 === 0)
      )
    )
  ).toEqual([false])
})

test('when true', async () => {
  expect(
    await toArray(
      fromIterable([5, 10, 15, 20]).pipeThrough(
        every((chunk) => chunk % 5 === 0)
      )
    )
  ).toEqual([true])
})