import { fromTimeline, write } from '../../src/index.js'
import { merge } from '@johngw/stream-common'

test('successfully merge all streams', async () => {
  await expect(
    merge([
      fromTimeline(`
    -1-----2-----3----|
      `),
      fromTimeline(`
    -1-----2-----3----|
      `),
      fromTimeline(`
    -4-----5-----6----|
      `),
    ])
  ).toMatchTimeline(`
    -1-1-4-2-2-5-3-3-6-
  `)
})

test('aborted merged streams', async () => {
  await expect(
    merge([
      fromTimeline(`
    -1-----2-----3----|
      `),
      fromTimeline(`
    -1-----2-----3----|
      `),
      fromTimeline(`
    -4-----5-----6----|
      `),
    ]).pipeTo(write(), { signal: AbortSignal.abort() })
  ).rejects.toThrow()
})

test('cancelling the stream will cancel all upstreams', async () => {
  const oneCancel = jest.fn()
  const one = new ReadableStream({
    pull(controller) {
      controller.enqueue(1)
    },
    cancel: oneCancel,
  })

  const twoCancel = jest.fn()
  const two = new ReadableStream({
    pull(controller) {
      controller.enqueue(2)
    },
    cancel: twoCancel,
  })

  const three = merge([one, two])
  const reader = three.getReader()
  await reader.cancel('foobar')

  expect(oneCancel).toHaveBeenCalledWith('foobar')
  expect(twoCancel).toHaveBeenCalledWith('foobar')
})

test('merge streams of different lengths', async () => {
  await expect(
    merge([
      fromTimeline(`
    -1-|
      `),
      fromTimeline(`
    -a-----b-|
      `),
      fromTimeline(`
    -c-----d-----e---|
      `),
    ])
  ).toMatchTimeline(`
    -1-a-c-b-d---e----
  `)
})

test('asynchronous streams', async () => {
  await expect(
    merge([
      fromTimeline(`
    -1-|
      `),
      fromTimeline(`
    -----------a----------b-|
      `),
      fromTimeline(`
    ----------------c--------------------d--------------------e-|
      `),
    ])
  ).toMatchTimeline(`
    -1---------a----c-----b--------------d--------------------e-|
  `)
})

test('merging no streams closes the stream immediately', async () => {
  const fn = jest.fn()
  await merge([]).pipeTo(write(fn))
  expect(fn).not.toHaveBeenCalled()
})
