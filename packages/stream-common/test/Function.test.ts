import { check, Fail, Pass } from '../src/Test.js'
import { Accumulator, Predicate } from '../src/Function.js'

test('Accumulator', () => {
  check<
    Accumulator<number, number[]>,
    (accumulation: number[], chunk: number) => number[] | Promise<number[]>,
    Pass
  >()

  check<
    Accumulator<number, string>,
    (accumulation: string, chunk: number) => string | Promise<string>,
    Pass
  >()

  check<
    Accumulator<number, string>,
    (accumulation: string, chunk: number) => void,
    Fail
  >()

  check<
    Accumulator<number, string>,
    (accumulation: string, chunk: number) => string,
    Fail
  >()
})

test('Predicate', () => {
  check<Predicate<string>, (x: string) => boolean | Promise<boolean>, Pass>()

  check<Predicate<string>, (x: string) => boolean, Fail>()
})
