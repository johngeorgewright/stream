import { ControllableStream, map, write } from '../../src'

let controller: ControllableStream<number>

beforeEach(() => {
  controller = new ControllableStream()
})

test('gives ability to enqueue messages to a stream', async () => {
  const fn = jest.fn()
  controller.enqueue(1)
  controller.enqueue(2)
  const finished = controller.pipeTo(write(fn))
  controller.enqueue(3)
  controller.enqueue(4)
  controller.close()
  await finished
  expect(fn).toHaveBeenCalledTimes(4)
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
      [
        4,
      ],
    ]
  `)
})

test('piping', async () => {
  const fn = jest.fn()
  controller.enqueue(1)
  controller.enqueue(2)
  controller.close()
  await controller.pipeThrough(map((x) => x + 1)).pipeTo(write(fn))
  expect(fn).toHaveBeenCalledTimes(2)
  expect(fn.mock.calls).toMatchInlineSnapshot(`
    [
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
  expect(controller.desiredSize).toBe(1)
  controller.enqueue(1)
  expect(controller.desiredSize).toBe(0)
})

test('emitting errors', async () => {
  const promise = controller.pipeTo(write())
  controller.error(new Error('foo'))
  await expect(promise).rejects.toThrow('foo')
})

describe('pull subscription', () => {
  test('registering', async () => {
    let i = -1
    controller.onPull(() => ++i)
    controller.onPull(() => ++i)
    controller.onPull(() => ++i)

    await expect(
      controller.pipeTo(
        new WritableStream({
          write(chunk, controller) {
            if (chunk === 3) controller.error(new Error('I have enough'))
          },
        })
      )
    ).rejects.toThrow('I have enough')

    expect(i).toBe(5)
  })

  test('unsubscribing', async () => {
    const fn = jest.fn(() => {
      unsubscribe()
      return 1
    })

    const unsubscribe = controller.onPull(fn)

    await controller
      .pipeTo(write(), { signal: AbortSignal.timeout(50) })
      .catch(() => {
        //
      })

    expect(fn).toHaveBeenCalledTimes(1)
  })

  test('erroring listenrs will error downstream', async () => {
    controller.onPull(() => {
      throw new Error('foo')
    })
    await expect(controller.pipeTo(write())).rejects.toThrow('foo')
  })
})
