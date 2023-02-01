import { every } from '../src/every'
import { fromIterable } from '../src/fromIterable'
import { toArray } from '../src/toArray'

test('when not', async () => {
  expect(
    await toArray(
      fromIterable([5, 10, 15, 18, 20]).pipeThrough(
        every((chunk) => chunk % 5 === 0)
      )
    )
  ).toBe([false])
})

test('when true', async () => {
  expect(
    await toArray(
      fromIterable([5, 10, 15, 20]).pipeThrough(
        every((chunk) => chunk % 5 === 0)
      )
    )
  ).toBe([true])
})
