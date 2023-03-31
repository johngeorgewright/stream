import { Subject, write } from '../../src/index.js'

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

test('pulling from subject', async () => {
  const subject = new Subject<number>()
  let i = 0
  subject.onPull(() => {
    if (i === 3) {
      subject.close()
      return undefined
    }
    return ++i
  })
  const fn = jest.fn()
  await subject.fork().pipeTo(write(fn))
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

test('back pressure', async () => {
  const subject = new Subject<number>()
  expect(subject.desiredSize).toBe(1)
  subject.enqueue(1)
  expect(subject.desiredSize).toBe(0)
})

test('erroring subjects', async () => {
  let errored = false
  const subject = new Subject<number>()
  const promise = subject
    .fork()
    .pipeTo(write())
    .catch(() => {
      errored = true
    })
  subject.error(new Error('foo'))
  await promise
  expect(errored).toBe(true)
})
