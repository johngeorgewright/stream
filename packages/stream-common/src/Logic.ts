import { Stringable } from './String.js'

export function when<T extends string | number>(
  choices: Record<T, Stringable> & { _: Stringable },
  key: string | number
) {
  return key in choices ? choices[key as T] : choices._
}
