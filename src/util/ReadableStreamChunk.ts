export type ReadableStreamChunk<R extends ReadableStream<unknown>> =
  R extends ReadableStream<infer T> ? T : never
