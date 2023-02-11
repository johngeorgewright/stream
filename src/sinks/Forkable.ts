export interface Forkable<T> {
  fork(): ReadableStream<T>
}
