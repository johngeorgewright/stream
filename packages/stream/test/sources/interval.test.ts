import { interval, write } from '../../src/index.js'

test('continuasly emits date events until terminated', (done) => {
  const fn = jest.fn()

  interval(50)
    .pipeTo(write(fn), { signal: AbortSignal.timeout(400) })
    .catch(() => {
      expect(fn.mock.calls.length).toBeGreaterThanOrEqual(5)
      done()
    })
})
