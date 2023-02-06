import {
  StatefulSubject,
  StatefulSubjectBaseActions,
} from '../../src/subjects/StatefulSubject'
import { write } from '../../src/sinks/write'

test('updating a stateful resource in a stream', async () => {
  interface State {
    authors: string[]
  }

  interface Actions extends StatefulSubjectBaseActions {
    'add author': string
  }

  const subject = new StatefulSubject<Actions, State>({
    __INIT__: () => ({ authors: [] }),

    'add author': (author, state) =>
      state.authors.includes(author)
        ? state
        : {
            ...state,
            authors: [...state.authors, author],
          },
  })

  const fn = jest.fn()
  const promise = subject.fork().pipeTo(write(fn))

  subject.dispatch('add author', 'Jane Austin')
  subject.dispatch('add author', 'Jane Austin')
  subject.close()
  await promise

  expect(fn).toHaveBeenCalledTimes(2)
  expect(fn.mock.calls).toMatchInlineSnapshot(`
    [
      [
        {
          "action": "__INIT__",
          "state": {
            "authors": [],
          },
        },
      ],
      [
        {
          "action": "add author",
          "state": {
            "authors": [
              "Jane Austin",
            ],
          },
        },
      ],
    ]
  `)
})
