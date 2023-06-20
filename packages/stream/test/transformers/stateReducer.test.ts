import '@johngw/stream-jest'
import { Pass, check, checks, fromTimeline } from '@johngw/stream-test'
import {
  StateReducerInput,
  StateReducerOutput,
  StateReducers,
  stateReducer,
} from '../../src/index.js'

interface State {
  authors: string[]
}

type Actions = {
  'add author': string
  nothing: void
}

function transform() {
  return stateReducer<Actions, State>({
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
}

test('StateReducerInput', () => {
  checks([
    check<
      StateReducerInput<{ foo: string; bar: number; nothing: void }>,
      | { action: '__INIT__' }
      | { action: 'foo'; param: string }
      | { action: 'bar'; param: number }
      | { action: 'nothing' },
      Pass
    >(),
  ])
})

test('StateReducerOutput', () => {
  checks([
    check<
      StateReducerOutput<{ foo: string; bar: number; nothing: void }, string>,
      | { action: '__INIT__'; state: string }
      | { action: 'foo'; param: string; state: string }
      | { action: 'bar'; param: number; state: string }
      | { action: 'nothing'; state: string },
      Pass
    >(),
  ])
})

test('StateReducers', () => {
  interface State {
    foos: string[]
  }

  interface Actions {
    foo: string
  }

  check<
    StateReducers<State, Actions>,
    {
      __INIT__(): State
      foo(state: State, param: string): State
    },
    Pass
  >()
})

test('the __INIT__ action', async () => {
  await expect(
    fromTimeline(`
    -|
    `).pipeThrough(transform())
  ).toMatchTimeline(`
    -{ action: __INIT__, state: { authors: [] } }-
  `)
})

test('a reducer that changes state', async () => {
  await expect(
    fromTimeline(`
    ----------------------------------------------{ action: add author, param: Jane Austin }-----------------------------------|
    `).pipeThrough(transform())
  ).toMatchTimeline(`
    -{ action: __INIT__, state: { authors: [] } }-{ action: add author, param: Jane Austin, state: { authors: [Jane Austin] } }-
  `)
})

test('a reducer that doesnt change state', async () => {
  await expect(
    fromTimeline(`
    ----------------------------------------------{ action: nothing }-|
    `).pipeThrough(transform())
  ).toMatchTimeline(`
    -{ action: __INIT__, state: { authors: [] } }----------------------
  `)
})

test('multiple calls', async () => {
  await expect(
    fromTimeline(
      '-{ action: add author, param: Jane Austin }-' +
        '-{ action: add author, param: George Orwell }-' +
        '-{ action: add author, param: Jane Austin }-|'
    ).pipeThrough(transform())
  ).toMatchTimeline(
    '-{ action: __INIT__, state: { authors: [] } }-' +
      '-{ action: add author, param: Jane Austin, state: { authors: [Jane Austin] } }-' +
      '-{ action: add author, param: George Orwell, state: { authors: [Jane Austin, George Orwell] } }-'
  )
})
