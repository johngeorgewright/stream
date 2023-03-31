import { immediatelyClosingReadableStream } from '../../src/index.js'

test('it closes the stream immediately', async () => {
  const fn = jest.fn()
  await immediatelyClosingReadableStream().pipeTo(
    new WritableStream({ write: fn })
  )
  expect(fn).not.toHaveBeenCalled()
})
