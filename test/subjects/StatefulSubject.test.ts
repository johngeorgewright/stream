import { StatefulSubject, write } from '../../src/index.js'
import { timeout } from '../../src/utils/Async.js'

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
  // There's a bug in the web-streams-polyfill that resolves the above
  // promise too early.
  await timeout()
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

test('typing errors', () => {
  expect(
    () =>
      new StatefulSubject<Actions, State>(
        // @ts-expect-error There is no __INIT__ method
        {
          'add author': (state) => state,
        }
      )
  ).toThrow()

  new StatefulSubject<Actions, State>({
    // @ts-expect-error Incorrect state shape
    __INIT__: () => ({ mung: 'face' }),

    // @ts-expect-error Function declaration does not match action
    nothing: (state: State, param: string) => ({ ...state, authors: [param] }),
  })

  subject.close()
  return subject.fork().pipeTo(
    write((chunk) => {
      if (chunk.action === 'nothing') {
        console.info(
          // @ts-expect-error There is no param for the 'nothing' action
          chunk.param
        )
      }

      // @ts-expect-error Unknown action name
      if (chunk.action === 'unknown') {
        //
      }
    })
  )
})
