import { setImmediate } from 'node:timers/promises'
import { fromDOMMutations, write } from '../../src/index.js'

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

  await setImmediate()

  const div = document.createElement('div')
  div.appendChild(p)

  await setImmediate()

  document.body.appendChild(div)

  await setImmediate()

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

  await setImmediate()

  expect(fn).not.toHaveBeenCalled()
})
