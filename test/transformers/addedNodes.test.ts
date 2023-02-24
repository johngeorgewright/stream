import { setImmediate } from 'node:timers/promises'
import { addedNodes, fromDOMMutations, write } from '../../src'

test('picks added nodes from DOM mutations', async () => {
  const fn = jest.fn()

  fromDOMMutations(document.body, { childList: true })
    .pipeThrough(addedNodes())
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
