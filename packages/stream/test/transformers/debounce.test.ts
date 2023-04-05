import { fromTimeline } from '@johngw/stream-test'
import {
  debounce,
  DebounceBackOffBehavior,
  DebounceLeadingBehavior,
  DebounceTrailingBehavior,
} from '../../src/index.js'

test('trailing only (by default)', async () => {
  await expect(
    fromTimeline(`
    --1--2------T10--|
    `).pipeThrough(debounce(10))
  ).toMatchTimeline(`
    -----T8-2--------
  `)
})

test('leading only', async () => {
  await expect(
    fromTimeline(`
    --1--2--T10-|
    `).pipeThrough(debounce(10, new DebounceLeadingBehavior()))
  ).toMatchTimeline(`
    --1--
  `)
})

test('leading and trailing', async () => {
  await expect(
    fromTimeline(`
    -1-2-3------------|
    `).pipeThrough(
      debounce(10, [
        new DebounceLeadingBehavior(),
        new DebounceTrailingBehavior(),
      ])
    )
  ).toMatchTimeline(`
    -1---T8-3--
  `)
})

test('back off', async () => {
  await expect(
    fromTimeline(`
    -1-2-3-4-T45-5----|
  `).pipeThrough(
      debounce(10, [
        new DebounceLeadingBehavior(),
        new DebounceBackOffBehavior({ inc: (x) => x * 2, max: 45 }),
      ])
    )
  ).toMatchTimeline(`
    -1-----T45---5----
  `)
})