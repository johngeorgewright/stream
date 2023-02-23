---
layout: page
title: Subjects
permalink: /extensions/subjects
parent: Extensions
---

[ControllableStream]: ./controllable-streams
[ForkableStream]: ./forkable-streams

# Subjects

A Subject is a combination of a [ControllableStream][] and a [ForkableStream][] giving the developer the ability to both queue items and fork the stream from the same object.

```typescript
const subject = new Subject<number>()

subject.enqueue(1)
subject.enqueue(2)
subject.enqueue(3)

subject.fork().pipeTo(write((chunk) => console.info(chunk)))
```

## StatefulSubject

Another form of the `Subject` that reduces a piece of state with actions and queues changes to the stream.

It's important to note that if the result of an action does not change the state then nothing is queued to the stream.

```typescript
// The State will be the type of data you want to manipulate.
interface State {
  authors: string[]
}

// The Actions are a record of "action name" to a parameter.
// If the action doesn't require a parameter, use `void`.
type Actions = {
  'add author': string
  'action that doesnt need a parameter': void
}

// To get the best out of this API, pass the Actions type and State
// during construction.
const subject = new StatefulSubject<Actions, State>({
  __INIT__: () => ({ authors: [] }),

  'add author': (state, author) =>
    state.authors.includes(author)
      ? state
      : {
          ...state,
          authors: [...state.authors, author],
        },

  'action that doesnt need a parameter': (state) => state,
})

subject.fork().pipeTo(write(console.info))
// { action: '__INIT__', state: { authors: [] } }

subject.dispatch('add author', 'Jane Austin')
// { action: 'add author', param: 'Jane Austin', state: { authors: ['Jane Austin'] } }

subject.dispatch('add author', 'Jane Austin')
// **Nothing will be queued as the state did not change.**
```
