export function identity<T>() {
  return new TransformStream<T, T>()
}
