/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/ban-ts-comment */

import { utils } from '../../src'
import { IsNumber, IsString, IsStringOrNumber } from '../util'

test('ReadableStreamChunk', () => {
  type A = utils.ReadableStreamChunk<ReadableStream<string>>
  type B = IsString<A>
  // @ts-expect-error
  type C = IsNumber<A>

  type D = utils.ReadableStreamChunk<ReadableStream<number>>
  type E = IsNumber<D>
  // @ts-expect-error
  type F = IsString<D>

  type G = utils.ReadableStreamChunk<ReadableStream<string | number>>
  type H = IsStringOrNumber<G>
})

test('ReadableStreamsChunk', () => {
  type A = utils.ReadableStreamsChunk<ReadableStream<string>[]>
  type B = IsString<A>
  // @ts-expect-error
  type C = IsNumber<A>

  type D = utils.ReadableStreamsChunk<ReadableStream<number>[]>
  type E = IsNumber<D>
  // @ts-expect-error
  type F = IsString<D>

  type G = utils.ReadableStreamsChunk<ReadableStream<string | number>[]>
  type H = IsStringOrNumber<G>

  type I = utils.ReadableStreamsChunk<
    [ReadableStream<string> | ReadableStream<number>]
  >
  type J = IsStringOrNumber<G>
})

test('ReadableStreamsChunks', () => {
  type Expect<T extends [string, number]> = T
  type DontExpect<T extends [number, string]> = T
  type A = utils.ReadableStreamsChunks<
    [ReadableStream<string>, ReadableStream<number>]
  >
  type B = Expect<A>
  // @ts-expect-error
  type D = DontExpect<A>
})
