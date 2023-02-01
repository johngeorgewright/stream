export interface Accumulator<I, O> {
  (accumulation: O, chunk: I): O | Promise<O>
}
