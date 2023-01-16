import { fromDOMEvent } from '../src/fromDOMEvent'

let element: HTMLAnchorElement

beforeEach(() => {
  element = document.createElement('a')
})

test('streams of click events', () => {
  const fn = jest.fn()
  const reader = fromDOMEvent(element, 'click').getReader()
  element.click()
  return reader
    .read()
    .then(fn)
    .then(() => {
      expect(fn).toHaveBeenCalled()
      expect(fn.mock.calls[0]).toMatchInlineSnapshot(`
        [
          {
            "done": false,
            "value": MouseEvent {
              "isTrusted": false,
            },
          },
        ]
      `)
    })
})
