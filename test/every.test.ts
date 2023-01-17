import { every } from '../src/every'
import { first } from '../src/first'
import { fromArray } from '../src/fromArray'

test('when not', async () => {
  expect(
    await first(
      fromArray([5, 10, 15, 18, 20]).pipeThrough(
        every((chunk) => chunk % 5 === 0)
      )
    )
  ).toBe(false)
})

test('when true', async () => {
  expect(
    await first(
      fromArray([5, 10, 15, 20]).pipeThrough(every((chunk) => chunk % 5 === 0))
    )
  ).toBe(true)
})
