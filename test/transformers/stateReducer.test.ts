import {
  ControllableStream,
  stateReducer,
  StateReducerInput,
  StateReducerOutput,
  write,
} from '../../src/index.js'

interface State {
  authors: string[]
}

type Actions = {
  'add author': string
  nothing: void
}

let controllable: ControllableStream<StateReducerInput<Actions>>
let fn: jest.Mock<void, [StateReducerOutput<Actions, State>]>
let finished: Promise<void>

beforeEach(() => {
  controllable = new ControllableStream()
  fn = jest.fn()
  finished = controllable
    .pipeThrough(
      stateReducer<Actions, State>({
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
    )
    .pipeTo(write(fn))
})

test('the __INIT__ action', async () => {
  controllable.close()
  await finished

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
  controllable.enqueue({ action: 'add author', param: 'Jane Austin' })
  controllable.close()
  await finished

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
  controllable.enqueue({ action: 'nothing' })
  controllable.close()
  await finished

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
  controllable.enqueue({ action: 'add author', param: 'Jane Austin' })
  controllable.enqueue({ action: 'add author', param: 'George Orwell' })
  controllable.enqueue({ action: 'add author', param: 'Jane Austin' })
  controllable.close()
  await finished

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
