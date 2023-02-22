---
layout: page
title: Forkable Streams
permalink: /extensions/forkable-streams
parent: Extensions
---

# Forkable Streams

A ForkableStream is "1 Writeable to many Readables".

```typescript
const forkable = new ForkableStream<T>()

fromIterable([1, 2, 3, 4, 5, 6, 7]).pipeTo(forkable)

forkable.fork().pipeTo(write((x) => console.info('fork1', x)))
// fork1 1
// fork1 2
// fork1 3
// fork1 4
// fork1 5
// fork1 6
// fork1 7

forkable.fork().pipeTo(write((x) => console.info('fork2', x)))
// fork2 1
// fork2 2
// fork2 3
// fork2 4
// fork2 5
// fork2 6
// fork2 7
```

## ForkableRecallStream

An extension to the `ForkableStream` that immediately queues the last received chunk to any fork.

```typescript
const forkable = new ForkableRecallStream<number>()
await fromIterable([1, 2, 3, 4, 5, 6, 7]).pipeTo(forkable)
```

Now the stream has finished, if we fork from it we'll
receive the last thing that was emitted.

```typescript
await forkable.fork().pipeTo(write(console.info))
// 7
```

## ForkableReplayStream

queues the entire contents of whatever has been previously consumed.

```typescript
const forkable = new ForkableReplayStream<number>()
await fromIterable([1, 2, 3, 4, 5, 6, 7]).pipeTo(forkable)
```

Now the stream has finished, if we fork from it we'll receive the entire events that were published to it.

```typescript
await forkable.fork().pipeTo(write(console.info))
// 1
// 2
// 3
// 4
// 5
// 6
// 7
```
