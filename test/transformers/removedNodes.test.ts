import { setImmediate } from 'node:timers/promises'
import { removedNodes, fromDOMMutations, write } from '../../src'

test('picks removed nodes from DOM mutations', async () => {
  const fn = jest.fn()

  fromDOMMutations(document.body, { childList: true })
    .pipeThrough(removedNodes())
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
        <p
          class="test"
        />,
      ],
    ]
  `)
})
