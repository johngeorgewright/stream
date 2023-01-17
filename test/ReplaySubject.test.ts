import { fromArray } from '../src/fromArray'
import { ReplaySubject } from '../src/ReplaySubject'

test('subscribing will replay all previously emitted values', async () => {
  const subject = new ReplaySubject(fromArray([1, 2, 3, 4, 5]))
  const fn1 = jest.fn()
  const fn2 = jest.fn()
  subject.subscribe(fn1)
  await subject.finished
  subject.subscribe(fn2)
  expect(fn1).toHaveBeenCalledTimes(5)
  expect(fn2).toHaveBeenCalledTimes(5)
})
