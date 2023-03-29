import { every, fromTimeline, write } from '../../src/index.js'
import '../../src/jest/extend.js'

test('when not', async () => {
  await expect(
    fromTimeline<number>(`
    -5-10-15-18-----X
    `).pipeThrough(every((chunk) => chunk % 5 === 0))
  ).toMatchTimeline(`
    ---------false---
  `)
})

test('when true', async () => {
  await expect(
    fromTimeline<number>(`
    -5-10-15-20-|
    `).pipeThrough(every((chunk) => chunk % 5 === 0))
  ).toMatchTimeline(`
    ------------true
  `)
})

test('flushing', async () => {
  await expect(
    fromTimeline<number>(`
    -5-10-15-20-------25-----|
    `).pipeThrough(
      every((chunk) => chunk % 5 === 0, {
        flushes: fromTimeline(`
    ------------null----------
        `),
      })
    )
  ).toMatchTimeline(`
    ------------true-----true-
  `)
})

test('allow flush errors to be sent down stream', async () => {
  await expect(
    fromTimeline(`
    -----
    `)
      .pipeThrough(
        every(() => true, {
          flushes: fromTimeline(`
    --E--
          `),
        })
      )
      .pipeTo(write())
  ).rejects.toThrow('Timeline Error')
})

test('disallow flush errors to be sent down stream', async () => {
  await expect(
    fromTimeline<number>(`
    -1-1---1--------|
    `).pipeThrough(
      every(() => true, {
        ignoreFlushErrors: true,
        flushes: fromTimeline(`
    -----E-----------
        `),
      })
    )
  ).toMatchTimeline(`
    ----------------true
  `)
})
