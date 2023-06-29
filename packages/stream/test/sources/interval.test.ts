import { interval } from '@johngw/stream/sources/interval'
import { write } from '@johngw/stream/sinks/write'

test('continuasly emits date events until terminated', (done) => {
  const fn = jest.fn()

  interval(50)
    .pipeTo(write(fn), { signal: AbortSignal.timeout(400) })
    .catch(() => {
      expect(fn.mock.calls.length).toBeGreaterThanOrEqual(5)
      done()
    })
})
