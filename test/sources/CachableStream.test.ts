import {
  CachableStream,
  MemoryStorage,
  StorageCache,
  write,
} from '../../src/index.js'
import { timeout } from '../../src/utils/index.js'

let cache: StorageCache

beforeEach(() => {
  cache = new StorageCache(new MemoryStorage(), 'test', 20)
})

test('only pulls when the cache is stale', async () => {
  const fn = jest.fn<void, [number]>()
  let i = 0

  new CachableStream<number>(cache, ['test'], () => ++i).pipeTo(write(fn))

  await timeout(10)
  expect(fn).toHaveBeenCalledTimes(1)
  expect(fn).toHaveBeenCalledWith(1)

  await timeout(15)
  expect(fn).toHaveBeenCalledTimes(2)
  expect(fn.mock.calls[1][0]).toBe(2)
})

test('invalidating cache', async () => {
  const fn = jest.fn<void, [number]>()
  let i = 0

  const cachableStream = new CachableStream<number>(
    cache,
    ['test'],
    () => ++i,
    1_000
  )
  cachableStream.pipeTo(write(fn))

  await timeout(5)
  expect(fn).toHaveBeenCalledTimes(1)
  expect(fn).toHaveBeenCalledWith(1)

  cachableStream.invalidate()
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
