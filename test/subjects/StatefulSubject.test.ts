import {
  StatefulSubject,
  StatefulSubjectBaseActions,
} from '../../src/subjects/StatefulSubject'
import { write } from '../../src/sinks/write'

interface State {
  authors: string[]
}

interface Actions extends StatefulSubjectBaseActions {
  'add author': string
  nothing: null
}

let subject: StatefulSubject<Actions, State>

beforeEach(() => {
  subject = new StatefulSubject<Actions, State>({
    __INIT__: () => ({ authors: [] }),

    'add author': (author, state) =>
      state.authors.includes(author)
        ? state
        : {
            ...state,
            authors: [...state.authors, author],
          },

    nothing: (_, state) => state,
  })
})

test('the __INIT__ action', async () => {
  const fn = jest.fn()
  subject.close()
  await subject.fork().pipeTo(write(fn))

  expect(fn).toHaveBeenCalledTimes(1)
  expect(fn.mock.calls).toMatchInlineSnapshot(`
    [
      [
        {
          "action": "__INIT__",
          "param": null,
          "state": {
            "authors": [],
          },
        },
      ],
    ]
  `)
})

test('a reducer that changes state', async () => {
  const fn = jest.fn()
  subject.dispatch('add author', 'Jane Austin')
  subject.close()
  await subject.fork().pipeTo(write(fn))

  expect(fn).toHaveBeenCalledTimes(1)
  expect(fn.mock.calls).toMatchInlineSnapshot(`
    [
      [
        {
          "action": "add author",
          "param": "Jane Austin",
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

test('a reducer that doesnt change state', async () => {
  const fn = jest.fn()
  subject.dispatch('nothing', null)
  subject.close()
  await subject.fork().pipeTo(write(fn))

  expect(fn).toHaveBeenCalledTimes(1)
  expect(fn.mock.calls).toMatchInlineSnapshot(`
    [
      [
        {
          "action": "__INIT__",
          "param": null,
          "state": {
            "authors": [],
          },
        },
      ],
    ]
  `)
})

test('multiple calls', async () => {
  const fn = jest.fn()
  const promise = subject.fork().pipeTo(write(fn))
  subject.dispatch('add author', 'Jane Austin')
  subject.dispatch('add author', 'George Orwell')
  subject.dispatch('add author', 'Jane Austin')
  subject.close()
  await promise

  expect(fn).toHaveBeenCalledTimes(3)
  expect(fn.mock.calls).toMatchInlineSnapshot(`
    [
      [
        {
          "action": "__INIT__",
          "param": null,
          "state": {
            "authors": [],
          },
        },
      ],
      [
        {
          "action": "add author",
          "param": "Jane Austin",
          "state": {
            "authors": [
              "Jane Austin",
            ],
          },
        },
      ],
      [
        {
          "action": "add author",
          "param": "George Orwell",
          "state": {
            "authors": [
              "Jane Austin",
              "George Orwell",
            ],
          },
        },
      ],
    ]
  `)
})
