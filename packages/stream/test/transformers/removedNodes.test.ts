import { timeout } from '@johngw/stream-common'
import { fromDOMMutations } from '@johngw/stream/sources/fromDOMMutations'
import { removedNodes } from '@johngw/stream/transformers/removedNodes'
import { write } from '@johngw/stream/sinks/write'

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
