---
layout: page
title: Timelines
permalink: /extensions/timelines
parent: Extensions
nav_order: 5
---

# Timelines

A timeline is the way to describe and test streams over a period of time. For example, consider the following:

```
--1--2--3--4--
```

The above is a stream that queues 1, 2, 3, 4.

The following is an example of merging 2 streams together and what the result would be after.

```
merge([
--1---2---3---4--
----a---b---c----
])

--1-a-2-b-3-c-4--
```

## Syntax

The syntax for timelines are as follows:

- strings: `imaastring`
- numbers: `1234`
- objects: `{key:value}`
- arrays: `[1,2,3]`
- errors: `E`
- close: `|`

## Testing

There are a couple functions to help with testing.

- [expectTimeline](/stream/api/functions/expectTimeline.html)
- [fromTimeline](/stream/api/functions/fromTimeline.html)
