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

### Numbers

Anything matching the regular expression `\d+(\.\d+)?` will be considered a number.

For example:

- `1`
- `1000`
- `12.34`

### Objects

Objects will be parsed with the use of braces (`{ ... }`). **Keys and values should NOT be inside quotes**.

For example:

- `{a:b,c:d}`
- `{long key:log value}`
- `{foo:[{nested:object}]}`

### Arrays

Arrays will be parsed with the use of brackets (`[ ... ]`).

For example:

- `[1,2,3,4]`
- `[foo,bar]`
- `[{foo:bar}]`

### Errors

An error can be populated downstream with the capital letter `E`.

### Closing a stream

Although streams are closed with the timeline finishes, you may want to specify an earlier close with the pipe character: `|`.

### Never

Sometimes you may want to create an expectation that the timeline should **never** reach. Use the capital `X` for such a scenario.

For example, the `buffer` transformer's test uses this to test when the buffer's `notifier` close even will close the source stream:

```
--1--2--3---X

buffer(
--------|
)

--------[1,2,3]
```

### Timers

To signal waiting for a period of milliseconds, use a capital `T` followed by a number, representing the amount of `milliseconds` to wait for.

For example:

```
--1--2------

debounce(10)

-----T10-2--
```

### Strings

Any combination of characters, other than a dash (`-`) or any of the above syntax, will be considered a string.

For example:

- `a`
- `a1`
- `1.2.3`
- `__$$%%`

## Testing

There are a couple functions to help with testing.

- [expectTimeline](/stream/api/functions/expectTimeline.html)
- [fromTimeline](/stream/api/functions/fromTimeline.html)
