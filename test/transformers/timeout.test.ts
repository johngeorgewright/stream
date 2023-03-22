import { timeout, write } from '../../src/index.js'
import { timeout as setTimeout } from '../../src/utils/index.js'

test('makes sure that events are emitted within a number of milliseconds', async () => {
  const fn = jest.fn<void, [number]>()

  await expect(
    new ReadableStream({
      async pull(controller) {
        await setTimeout(500)
        controller.enqueue(1)
        controller.close()
      },
    })
      .pipeThrough(timeout(10))
      .pipeTo(write(fn))
  ).rejects.toThrow('Exceeded 10ms')

  expect(fn).not.toHaveBeenCalled()

  await new ReadableStream({
    async pull(controller) {
      await setTimeout(5)
      controller.enqueue(1)
      await setTimeout(5)
      controller.enqueue(2)
      controller.close()
    },
  })
    .pipeThrough(timeout(50))
    .pipeTo(write(fn))

  expect(fn.mock.calls).toMatchInlineSnapshot(`
    [
      [
        1,
      ],
      [
        2,
      ],
    ]
  `)
})
