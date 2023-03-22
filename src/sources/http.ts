import { HTTPError } from '../utils/Error.js'

/**
 * Issues a `fetch` request and streams the result.
 *
 * @remarks
 * If the response code is not in the `200` range the stream
 * will receive a {@link HTTPError}.
 *
 * @group Sources
 * @example
 * ```
 * http('https://httpbin.org/delay/2', {
 *   method: 'POST',
 *   headers: {
 *     'Content-Type': 'application/json',
 *   },
 *   body: {
 *     foo: 'bar'
 *   }
 * })
 *   .pipeTo(write(console.info))
 * ```
 */
export function http(
  input: RequestInfo | URL,
  init?: RequestInit,
  queuingStrategy?: QueuingStrategy<unknown>
) {
  return new ReadableStream<unknown>(
    {
      async start(controller) {
        let response: Response

        try {
          response = await fetch(input, init)
        } catch (error) {
          return controller.error(error)
        }

        if (!response.ok)
          return controller.error(
            new HTTPError(response.status, response.statusText)
          )

        if (response.headers.get('content-type') === 'application/json')
          controller.enqueue(await response.json())
        else controller.enqueue(await response.text())

        controller.close()
      },
    },
    queuingStrategy
  )
}
