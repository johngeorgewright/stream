import { BehaviorSubject } from '../src/BehaviorSubject'
import { fromArray } from '../src/fromArray'

test('subscribing will always provide that last chunk', async () => {
  const subject = new BehaviorSubject(fromArray([1, 2, 3, 4, 5]))
  const fn1 = jest.fn()
  const fn2 = jest.fn()
  subject.subscribe(fn1)
  await subject.finished
  subject.subscribe(fn2)
  expect(fn1).toHaveBeenCalledTimes(5)
  expect(fn2).toHaveBeenCalledTimes(1)
  expect(fn2).toHaveBeenCalledWith(5)
})
