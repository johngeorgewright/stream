import { map } from './map'

export function withCounter<T>(start = 0) {
  let counter = start
  return map<T, { chunk: T; counter: number }>((chunk) => ({
    chunk,
    counter: counter++,
  }))
}
