import { fromArray } from '../src/fromArray'
import { Subject } from '../src/Subject'

test('one subscription', async () => {
  const subject = new Subject(fromArray([1, 2, 3, 4, 5]))
  const fn = jest.fn()
  subject.subscribe(fn)
  await subject.finished
  expect(fn).toHaveBeenCalledTimes(5)
})

test('multiple subscribers', async () => {
  const subject = new Subject(fromArray([1, 2, 3, 4, 5]))
  const fn = jest.fn()
  subject.subscribe(fn)
  subject.subscribe(fn)
  subject.subscribe(fn)
  await subject.finished
  expect(fn).toHaveBeenCalledTimes(15)
})
