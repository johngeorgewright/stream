import { StatefulSubject } from '../../src/subjects/StatefulSubject'
import { write } from '../../src/sinks/write'

interface State {
  authors: string[]
}

type Actions = {
  'add author': string
  nothing: void
}

let subject: StatefulSubject<Actions, State>

beforeEach(() => {
  subject = new StatefulSubject<Actions, State>({
    __INIT__: () => ({ authors: [] }),

    'add author': (state, author) =>
      state.authors.includes(author)
        ? state
        : {
            ...state,
            authors: [...state.authors, author],
          },

    nothing: (state) => state,
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
  subject.dispatch('nothing')
  subject.close()
  await subject.fork().pipeTo(write(fn))

  expect(fn).toHaveBeenCalledTimes(1)
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
