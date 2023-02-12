import { interval, write } from '../../src'

test('continuasly emits date events until terminated', (done) => {
  const fn = jest.fn()

  interval(50)
    .pipeTo(write(fn), { signal: AbortSignal.timeout(300) })
    .catch(() => {
      expect(fn).toHaveBeenCalledTimes(5)
      done()
    })
})
