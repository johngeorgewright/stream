import { immediatelyClosingReadableStream, write } from '../../src'

test('it closes the stream immediately', async () => {
  const fn = jest.fn()
  await immediatelyClosingReadableStream().pipeTo(write(fn))
  expect(fn).not.toHaveBeenCalled()
})
