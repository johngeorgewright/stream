import { fromDOMIntersections } from '@johngw/stream/sources/fromDOMIntersections'
import { write } from '@johngw/stream/sinks/write'
import {
  CallIntersectionObserver,
  IntersectionObserverMock,
  boundingClientRect,
  mockIntersectionObserver,
} from '#mock-intersection-observer'
import { timeout } from '@johngw/stream-common'

let callIntersectionObservers: CallIntersectionObserver
let IntersectionObserverMock: IntersectionObserverMock
let target: HTMLDivElement
let unmockIntersectionObserver: () => void

beforeEach(() => {
  target = document.createElement('div')
  ;({
    callIntersectionObservers,
    IntersectionObserverMock,
    unmock: unmockIntersectionObserver,
  } = mockIntersectionObserver())
})

afterEach(() => {
  unmockIntersectionObserver()
})

test('receive notification when element is scrolled in to view', async () => {
  const fn = jest.fn<void, [IntersectionObserverEntry]>()
  const entry = {
    boundingClientRect: boundingClientRect(),
    intersectionRatio: 1,
    intersectionRect: boundingClientRect(),
    isIntersecting: true,
    rootBounds: boundingClientRect(),
    target,
    time: Date.now(),
  }
  fromDOMIntersections()(target).pipeTo(write(fn))
  callIntersectionObservers([entry])
  await timeout()
  expect(fn).toHaveBeenCalledTimes(1)
  expect(fn.mock.calls[0][0]).toBe(entry)
})

test('only receives notifications of current target', async () => {
  const fn = jest.fn<void, [IntersectionObserverEntry]>()
  fromDOMIntersections()(target).pipeTo(write(fn))
  callIntersectionObservers([
    {
      boundingClientRect: boundingClientRect(),
      intersectionRatio: 1,
      intersectionRect: boundingClientRect(),
      isIntersecting: true,
      rootBounds: boundingClientRect(),
      target: document.createElement('div'),
      time: Date.now(),
    },
  ])
  await timeout()
  expect(fn).not.toHaveBeenCalled()
})

test('errored streams will remove observers', async () => {
  const fn = jest.fn<void, [IntersectionObserverEntry]>()
  const entry = {
    boundingClientRect: boundingClientRect(),
    intersectionRatio: 1,
    intersectionRect: boundingClientRect(),
    isIntersecting: true,
    rootBounds: boundingClientRect(),
    target,
    time: Date.now(),
  }
  await expect(() =>
    fromDOMIntersections()(target).pipeTo(write(fn), {
      signal: AbortSignal.abort(),
    })
  ).rejects.toThrow()
  callIntersectionObservers([entry])
  await timeout()
  expect(fn).not.toHaveBeenCalled()
})
