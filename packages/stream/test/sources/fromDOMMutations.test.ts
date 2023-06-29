import { fromDOMMutations } from '@johngw/stream/sources/fromDOMMutations'
import { write } from '@johngw/stream/sinks/write'
import { timeout } from '@johngw/stream-common'

test('stream of DOM mutations', async () => {
  const fn = jest.fn()

  fromDOMMutations(document.body, { childList: true })
    .pipeThrough(
      new TransformStream({
        transform(chunk, controller) {
          controller.enqueue({
            added: chunk.addedNodes,
            removed: chunk.removedNodes,
          })
        },
      })
    )
    .pipeTo(write(fn))

  const p = document.createElement('p')
  p.classList.add('test')
  document.body.appendChild(p)

  await timeout()

  const div = document.createElement('div')
  div.appendChild(p)

  await timeout()

  document.body.appendChild(div)

  await timeout()

  expect(fn.mock.calls).toMatchInlineSnapshot(`
    [
      [
        {
          "added": NodeList [
            <p
              class="test"
            />,
          ],
          "removed": NodeList [],
        },
      ],
      [
        {
          "added": NodeList [],
          "removed": NodeList [
            <p
              class="test"
            />,
          ],
        },
      ],
      [
        {
          "added": NodeList [
            <div>
              <p
                class="test"
              />
            </div>,
          ],
          "removed": NodeList [],
        },
      ],
    ]
  `)
})

test('cancelling the stream will disconnect the observer', async () => {
  const fn = jest.fn()

  fromDOMMutations(document.body, { childList: true })
    .pipeTo(write(fn), { signal: AbortSignal.abort() })
    .catch(() => {
      //
    })

  const p = document.createElement('p')
  p.classList.add('test')
  document.body.appendChild(p)

  await timeout()

  expect(fn).not.toHaveBeenCalled()
})
