import { fromIterable } from '../src/sources/fromIterable'
import { toArray } from '../src/sinks/toArray'

test('iterables', async () => {
  expect(await toArray(fromIterable([0, 1, 2]))).toEqual([0, 1, 2])
})

test('async iterables', async () => {
  expect(
    await toArray(
      fromIterable(
        (async function* () {
          yield 0
          yield 1
          yield 2
        })()
      )
    )
  ).toEqual([0, 1, 2])
})

test('node lists', async () => {
  for (let i = 0; i < 3; i++)
    document.documentElement.appendChild(document.createElement('p'))
  expect(await toArray(fromIterable(document.querySelectorAll('p'))))
    .toMatchInlineSnapshot(`
    [
      <p />,
      <p />,
      <p />,
    ]
  `)
})
