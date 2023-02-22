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
