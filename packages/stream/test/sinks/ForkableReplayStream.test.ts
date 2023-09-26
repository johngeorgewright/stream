import { ForkableReplayStream } from '@johngw/stream/sinks/ForkableReplayStream'
import { expectTimeline, fromTimeline } from '@johngw/stream-jest'

test('subscribing will replay all previously emitted values', async () => {
  const forkable = new ForkableReplayStream()

  await fromTimeline(`
    --1--2--3--4--5--|
  `).pipeTo(forkable)

  await forkable.fork().pipeTo(
    expectTimeline(`
    --1--2--3--4--5--
    `)
  )

  await forkable.fork().pipeTo(
    expectTimeline(`
    --1--2--3--4--5--
    `)
  )
})

test('max size', async () => {
  const forkable = new ForkableReplayStream(2)

  await fromTimeline(`
    --1--2--3--4--5--|
  `).pipeTo(forkable)

  await forkable.fork().pipeTo(
    expectTimeline(`
    -----------4--5--
    `)
  )
})

test('clearing', async () => {
  const forkable = new ForkableReplayStream()

  await fromTimeline(`
    --1--2--3--4--5--|
  `).pipeTo(forkable)

  forkable.clear()

  await forkable.fork().pipeTo(
    expectTimeline(`
    X
    `)
  )
})
