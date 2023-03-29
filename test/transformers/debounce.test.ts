import {
  debounce,
  DebounceBackOffBehavior,
  DebounceLeadingBehavior,
  DebounceTrailingBehavior,
  fromTimeline,
} from '../../src/index.js'
import '../../src/jest/extend.js'

test('trailing only (by default)', async () => {
  await expect(
    fromTimeline(`
    --1--2------T10--|
    `).pipeThrough(debounce(10))
  ).toMatchTimeline(`
    -----T9-2--------|
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
    -1---T9-3--|
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
    -1-----T45---5----|
  `)

  // controller
  //   .pipeThrough(
  //     debounce(10, [
  //       new DebounceLeadingBehavior(),
  //       new DebounceBackOffBehavior({ inc: (x) => x * 2, max: 45 }),
  //     ])
  //   )
  //   .pipeTo(write(fn))

  // controller.enqueue(1)
  // controller.enqueue(2)
  // await timeout(15)
  // expect(fn).toHaveBeenCalledTimes(1)
  // expect(fn).toHaveBeenCalledWith(1)

  // await timeout(10)
  // controller.enqueue(3)
  // controller.enqueue(4)
  // expect(fn).toHaveBeenCalledTimes(2)
  // expect(fn).toHaveBeenCalledWith(3)
})
