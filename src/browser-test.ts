import { tap } from './transformers/tap'
import { toArray } from './sinks/toArray'
import { fromDOMEvent } from './sources/fromDOMEvent'
import {
  debounce,
  DebounceLeadingBehavior,
  DebounceTrailingBehavior,
} from './transformers/debounce'
import { write } from './sinks/write'

fromDOMEvent(window, 'scroll')
  .pipeThrough(
    debounce(300, [
      new DebounceLeadingBehavior(),
      new DebounceTrailingBehavior(),
    ])
  )
  .pipeTo(write(console.info))

toArray(startAuction().pipeThrough(tap((bid) => console.info('bid', bid))), {
  catch: true,
  signal: AbortSignal.timeout(2_000),
}).then(console.info)

function startAuction() {
  let timer: NodeJS.Timer

  return new ReadableStream<number>({
    start(controller) {
      receiveBid()

      function receiveBid() {
        timer = setTimeout(() => {
          controller.enqueue(Math.random())
          receiveBid()
        }, Math.random() * 1_000)
      }
    },

    cancel() {
      clearTimeout(timer)
    },
  })
}
