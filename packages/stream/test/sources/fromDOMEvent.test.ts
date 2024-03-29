import { fromDOMEvent } from '@johngw/stream/sources/fromDOMEvent'
import { write } from '@johngw/stream/sinks/write'
import { first } from '@johngw/stream/transformers/first'

let element: HTMLAnchorElement

beforeEach(() => {
  element = document.createElement('a')
  document.body.appendChild(element)
})

afterEach(() => {
  element.remove()
})

test('click events', async () => {
  const fn = jest.fn()

  const finished = fromDOMEvent(element, 'click')
    .pipeThrough(first())
    .pipeTo(write(fn))

  element.click()

  await finished

  expect(fn).toHaveBeenCalledTimes(1)
  expect(fn.mock.calls[0]).toMatchInlineSnapshot(`
    [
      MouseEvent {
        "isTrusted": false,
      },
    ]
  `)
})
