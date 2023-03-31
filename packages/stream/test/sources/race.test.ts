import { fromTimeline, race, write } from '../../src/index.js'

test('mirrors the first source stream to queue an item', async () => {
  await expect(
    race([
      fromTimeline(`
    -T1000-1-|
      `),
      fromTimeline(`
    -T10---2-|
      `),
    ])
  ).toMatchTimeline(`
    -------2-
  `)
})

test('immediately closes if there are 0 streams', async () => {
  const fn = jest.fn()
  await race([]).pipeTo(write(fn))
  expect(fn).not.toHaveBeenCalled()
})

test('receives an error from the first stream that errors', async () => {
  await expect(
    race([
      fromTimeline(`
    ------------------------------E(foo)-|
      `),
      fromTimeline(`
    -----------2-----------------------------3-|
      `),
    ]).pipeTo(write())
  ).rejects.toThrow('foo')
})

test('cancels upstream when aborted', async () => {
  await expect(
    race([
      fromTimeline(`
    ----X
      `),
    ]).pipeTo(write(), { signal: AbortSignal.abort() })
  ).rejects.toThrow()
})
