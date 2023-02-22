---
layout: page
title: Controllable Streams
permalink: /extensions/controllable-streams
parent: Extensions
---

# Controllable Streams

A ControllableStream is a `ReadableStream` that can have chunks queued to from an external source.

## Example

```typescript
const controller = new ControllableStream<number>()
controller.enqueue(1)
controller.enqueue(2)
controller.enqueue(3)
controller.close()
```

Or using pull listeners:

```typescript
const controller = new ControllableStream<number>()
let i = -1
controller.onPull(() => ++i)
```
