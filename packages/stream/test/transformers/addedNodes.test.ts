import { addedNodes, fromDOMMutations, write } from '../../src/index.js'
import { timeout } from '@johngw/stream-common'

test('picks added nodes from DOM mutations', async () => {
  const fn = jest.fn()

  fromDOMMutations(document.body, { childList: true })
    .pipeThrough(addedNodes())
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
        <p
          class="test"
        />,
      ],
      [
        <div>
          <p
            class="test"
          />
        </div>,
      ],
    ]
  `)
})
