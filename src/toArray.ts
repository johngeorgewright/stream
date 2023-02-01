import { consume } from './consume'

export interface ToArrayOptions extends StreamPipeOptions {
  /**
   * When set to true, any errors are caught and the accumulated
   * result is always resolved.
   */
  catch?: boolean
}

/**
 * Consumes all chunks in the streams resolves them as an array.
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

  const promise = consume(
    readableStream,
    (chunk) => result.push(chunk),
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
