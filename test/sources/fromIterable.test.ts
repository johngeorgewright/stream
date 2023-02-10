import { fromIterable, toArray } from '../../src'

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

describe('node lists', () => {
  beforeEach(() => {
    for (let i = 0; i < 3; i++)
      document.documentElement.appendChild(document.createElement('p'))
  })

  afterEach(() => {
    Array.from(document.querySelectorAll('p')).forEach((p) => p.remove())
  })

  test('is iterable', async () => {
    expect(await toArray(fromIterable(document.querySelectorAll('p'))))
      .toMatchInlineSnapshot(`
    [
      <p />,
      <p />,
      <p />,
    ]
  `)
  })
})
