import { timeout } from '@johngw/stream-common'
import { removedNodes, fromDOMMutations, write } from '../../src/index.js'

test('picks removed nodes from DOM mutations', async () => {
  const fn = jest.fn()

  fromDOMMutations(document.body, { childList: true })
    .pipeThrough(removedNodes())
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
    ]
  `)
})
