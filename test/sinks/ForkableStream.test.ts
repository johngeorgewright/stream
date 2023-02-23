import { setImmediate, setTimeout } from 'node:timers/promises'
import { ForkableStream, fromIterable, interval, tap, write } from '../../src'

let forkable: ForkableStream<number>
let fn: jest.Mock<void, [number]>
let readable: ReadableStream<number>

beforeEach(() => {
  forkable = new ForkableStream()
  fn = jest.fn()
  readable = fromIterable([1, 2, 3, 4, 5])
})

test('fork before piping', async () => {
  const promise = forkable.fork().pipeTo(write(fn))
  readable.pipeTo(forkable)
  await promise
  expect(fn).toHaveBeenCalledTimes(5)
})

test('fork after piping', async () => {
  readable.pipeTo(forkable)
  await forkable.fork().pipeTo(write(fn))
  expect(fn).toHaveBeenCalledTimes(5)
})

test('multiple subscribers', async () => {
  readable.pipeTo(forkable)
  await Promise.all([
    forkable.fork().pipeTo(write(fn)),
    forkable.fork().pipeTo(write(fn)),
    forkable.fork().pipeTo(write(fn)),
  ])
  expect(fn).toHaveBeenCalledTimes(15)
})

test('finished property', async () => {
  await readable.pipeTo(forkable)
  expect(forkable.finished).toBe(true)
})

test('finished streams will immediately close forks', async () => {
  await readable.pipeTo(forkable)
  await forkable
    .fork({
      pull(controller) {
        controller.enqueue(6)
      },
    })
    .pipeTo(write(fn))
  expect(fn).not.toHaveBeenCalled()
})

describe('aborting', () => {
  let fn: jest.Mock<void, [Date]>
  let forkable: ForkableStream<Date>
  let abortController: AbortController

  beforeEach(() => {
    fn = jest.fn()
    forkable = new ForkableStream<Date>()
    abortController = new AbortController()
    interval(5)
      .pipeThrough(tap(fn))
      .pipeTo(forkable, { signal: abortController.signal })
      .catch(() => {
        //
      })
  })

  afterEach(async () => {
    abortController.abort()
  })

  test('previously aborted streams will error new forks', async () => {
    abortController.abort()
    await setImmediate()
    await expect(forkable.fork().pipeTo(write())).rejects.toThrow()
  })

  test('aborting an stream will error previous forks', async () => {
    const fork = forkable.fork().pipeTo(write())
    abortController.abort()
    await expect(fork).rejects.toThrow()
  })

  test('should not affect upstream', async () => {
    await expect(
      forkable.fork().pipeTo(write(), { signal: AbortSignal.timeout(10) })
    ).rejects.toThrow()
    await setTimeout(50)
    expect(fn.mock.calls.length).toBeGreaterThanOrEqual(6)
  })

  test('will cancel the fork', async () => {
    let cancelled = false
    await expect(
      forkable
        .fork({
          cancel() {
            cancelled = true
          },
        })
        .pipeTo(write(), { signal: AbortSignal.timeout(10) })
    ).rejects.toThrow()
    expect(cancelled).toBe(true)
  })
})
