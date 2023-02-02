import { write } from './write'

/**
 * @group Sinks
 */
export interface ToArrayOptions extends StreamPipeOptions {
  /**
   * When set to true, any errors are caught and the accumulated
   * result is always resolved.
   */
  catch?: boolean
}

/**
 * Consumes all chunks in the stream and resolves them as an array.
 *
 * @see ToArrayOptions
 * @group Sinks
 * @example
 * ```
 * --1--2--3--4--5--6--|
 *
 * toArray(stream)
 *
 * [1, 2, 3, 4, 5, 6]
 * ```
 *
 * Using the `catch` option will resolve whatever it
 * has consumed before the error is thrown.
 *
 * ```
 * --1--2--3--E--4--5--6--|
 *
 * toArray(stream, { catch: true })
 *
 * { result: [1, 2, 3], error: E }
 * ```
 */
export async function toArray<T>(
  readableStream: ReadableStream<T>,
  options: ToArrayOptions & { catch: true }
): Promise<{ error?: any; result: T[] }>

export async function toArray<T>(
  readableStream: ReadableStream<T>,
  options?: ToArrayOptions
): Promise<T[]>

export async function toArray<T>(
  readableStream: ReadableStream<T>,
  options?: ToArrayOptions
) {
  const result: T[] = []

  const promise = readableStream.pipeTo(
    write((chunk) => result.push(chunk)),
    options
  )

  if (options?.catch) {
    try {
      await promise
      return { result }
    } catch (error) {
      return { error, result }
    }
  } else {
    await promise
  }

  return result
}
