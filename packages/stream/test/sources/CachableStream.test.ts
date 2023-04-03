import {
  CachableStream,
  ControllableStream,
  MemoryStorage,
  StorageCache,
  write,
} from '../../src/index.js'
import { timeout } from '@johngw/stream-common'
import { cacheStream } from '../../src/sources/cacheStream.js'

let cache: StorageCache

beforeEach(() => {
  cache = new StorageCache(new MemoryStorage(), 'test', 20)
})

test('only pulls when the cache is stale', async () => {
  const fn = jest.fn<void, [number]>()
  let i = 0

  new CachableStream<number>(cache, ['test'], () => ({
    done: false,
    value: ++i,
  })).pipeTo(write(fn))

  await timeout(10)
  expect(fn).toHaveBeenCalledTimes(1)
  expect(fn).toHaveBeenCalledWith(1)

  await timeout(15)
  expect(fn).toHaveBeenCalledTimes(2)
  expect(fn.mock.calls[1][0]).toEqual(2)
})

test('invalidating cache', async () => {
  const fn = jest.fn<void, [number]>()
  let i = 0

  const cachableStream = new CachableStream<number>(
    cache,
    ['test'],
    () => ({ done: false, value: ++i }),
    1_000
  )
  cachableStream.pipeTo(write(fn))

  await timeout(5)
  expect(fn).toHaveBeenCalledTimes(1)
  expect(fn).toHaveBeenCalledWith(1)

  cachableStream.clear()
  await timeout()
  expect(fn).toHaveBeenCalledTimes(2)
  expect(fn.mock.calls[1][0]).toBe(2)
})

test('errors cancel the stream', async () => {
  const fn = jest.fn()
  await expect(
    new CachableStream<number>(cache, ['test'], fn).pipeTo(write(), {
      signal: AbortSignal.abort(),
    })
  ).rejects.toThrow()
  await timeout(5)
  expect(fn).toHaveBeenCalledTimes(1)
})

test('when the source finishes', async () => {
  const fn = jest.fn<void, [number]>()
  const controller = new ControllableStream<number>()
  controller.enqueue(1)
  controller.close()

  const cachableStream = cacheStream(cache, ['test'], controller)
  cachableStream.pipeTo(write(fn))
  await timeout(25)

  expect(fn).toHaveBeenCalledTimes(1)
  expect(fn).toHaveBeenCalledWith(1)
  expect(cachableStream).toHaveProperty('sourceHasFinished', true)
})
