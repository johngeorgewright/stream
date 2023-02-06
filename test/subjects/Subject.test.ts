import { Subject } from '../../src/subjects/Subject'
import { write } from '../../src/sinks/write'

test('ability to queue and fork from the same object', async () => {
  const subject = new Subject<number>()
  const fn = jest.fn()
  subject.enqueue(1)
  subject.enqueue(2)
  subject.enqueue(3)
  subject.close()
  await subject.fork().pipeTo(write(fn))
  expect(fn).toHaveBeenCalledTimes(3)
  expect(fn.mock.calls).toMatchInlineSnapshot(`
    [
      [
        1,
      ],
      [
        2,
      ],
      [
        3,
      ],
    ]
  `)
})
