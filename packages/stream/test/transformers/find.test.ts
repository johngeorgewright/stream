import { find, fromCollection, fromTimeline, write } from '../../src/index.js'

test('queues the first found chunk and then terminates the stream', async () => {
  await expect(
    fromTimeline(`
    -0-1-2-3-4-X
    `).pipeThrough(find((chunk) => chunk === 4))
  ).toMatchTimeline(`
    ---------4-X
  `)
})

test('using type guards', () => {
  type A = { type: 'a' }
  type B = { type: 'b' }
  type AB = A | B
  fromCollection<AB>([{ type: 'a' }, { type: 'b' }])
    .pipeThrough(find((chunk): chunk is B => chunk.type === 'b'))
    .pipeTo(
      write((chunk) => {
        // @ts-expect-error This comparison appears to be unintentional because the types '"b"' and '"a"' have no overlap.
        chunk.type === 'a'
        chunk.type === 'b'
      })
    )
})
