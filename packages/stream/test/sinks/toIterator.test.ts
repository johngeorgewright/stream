import {
  ControllableStream,
  fromCollection,
  toIterator,
} from '../../src/index.js'

test('iteration over a collection of values', async () => {
  const iterator = toIterator(fromCollection([1, 2, 3, 4, 5]))
  const values: number[] = []

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const result = await iterator.next()
    if (result.done) break
    values.push(result.value)
  }

  expect(values).toStrictEqual([1, 2, 3, 4, 5])
})

test('returning from the iterator will cancel the stream', async () => {
  const controller = new ControllableStream<number>({
    pull(controller) {
      controller.enqueue(1)
    },
  })

  const iterator = toIterator(controller)
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  await iterator.return!()

  expect(() => controller.enqueue(2)).toThrow(
    'The stream is not in a state that permits enqueue'
  )
})

test('throwing an error will cancel the stream', async () => {
  const controller = new ControllableStream<number>({
    pull(controller) {
      controller.enqueue(1)
    },
  })

  const iterator = toIterator(controller)
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  expect(await iterator.throw!(new Error('foo'))).toEqual({
    done: true,
    value: undefined,
  })

  expect(() => controller.enqueue(2)).toThrow(
    'The stream is not in a state that permits enqueue'
  )
})

test('aborting will cancel the stream', async () => {
  const controller = new ControllableStream<number>({
    pull(controller) {
      controller.enqueue(1)
    },
  })

  toIterator(controller, { signal: AbortSignal.abort(new Error('foo')) })

  expect(() => controller.enqueue(2)).toThrow(
    'The stream is not in a state that permits enqueue'
  )
})
