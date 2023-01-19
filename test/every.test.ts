import { every } from '../src/every'
import { first } from '../src/first'
import { fromIterable } from '../src/fromIterable'

test('when not', async () => {
  expect(
    await first(
      fromIterable([5, 10, 15, 18, 20]).pipeThrough(
        every((chunk) => chunk % 5 === 0)
      )
    )
  ).toBe(false)
})

test('when true', async () => {
  expect(
    await first(
      fromIterable([5, 10, 15, 20]).pipeThrough(
        every((chunk) => chunk % 5 === 0)
      )
    )
  ).toBe(true)
})
