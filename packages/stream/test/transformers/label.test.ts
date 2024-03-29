import { fromTimeline } from '@johngw/stream-jest'
import { label } from '@johngw/stream/transformers/label'

test('using a property', async () => {
  await expect(
    fromTimeline<string>(`
    -one-------------------two-------------------three------------------|
    `).pipeThrough(label('length'))
  ).toMatchTimeline(`
    -{label: 3,value: one}-{label: 3,value: two}-{label: 5,value: three}-
  `)
})

test('using a function', async () => {
  await expect(
    fromTimeline(`
    -6.1-------------------4.2-------------------6.3------------------|
    `).pipeThrough(label(Math.floor))
  ).toMatchTimeline(`
    -{label: 6,value: 6.1}-{label: 4,value: 4.2}-{label: 6,value: 6.3}-
  `)
})
