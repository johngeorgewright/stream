import { interval } from '../src/interval'
import { write } from '../src/write'

test('continuasly emits date events until terminated', (done) => {
  const fn = jest.fn()
  const abortController = new AbortController()
  setTimeout(() => abortController.abort(), 300)

  interval(50)
    .pipeTo(write(fn), { signal: abortController.signal })
    .catch(() => {
      expect(fn).toHaveBeenCalledTimes(5)
      done()
    })
})
