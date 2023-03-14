import { find, fromCollection, toArray, write } from '../../src/index.js'

test('queues the first found chunk and then terminates the stream', async () => {
  expect(
    await toArray(
      fromCollection([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]).pipeThrough(
        find((chunk) => chunk === 4)
      )
    )
  ).toEqual([4])
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
