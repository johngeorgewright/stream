import { fromArray } from '../src/fromArray'
import { Subject } from '../src/Subject'
import { write } from '../src/write'

test('one subscription', async () => {
  const subject = new Subject(fromArray([1, 2, 3, 4, 5]))
  const fn = jest.fn()
  await subject.subscribe().pipeTo(write(fn))
  expect(fn).toHaveBeenCalledTimes(5)
})

test('multiple subscribers', async () => {
  const subject = new Subject(fromArray([1, 2, 3, 4, 5]))
  const fn = jest.fn()
  await Promise.all([
    subject.subscribe().pipeTo(write(fn)),
    subject.subscribe().pipeTo(write(fn)),
    subject.subscribe().pipeTo(write(fn)),
  ])
  expect(fn).toHaveBeenCalledTimes(15)
})
