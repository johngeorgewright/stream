import { addedNodes } from './addedNodes'
import { fromDOMMutations } from './fromDOMMutations'
import { tap } from './tap'
import { toArray } from './toArray'
import { write } from './write'

toArray(startAuction().pipeThrough(tap((bid) => console.info('bid', bid))), {
  catch: true,
  signal: AbortSignal.timeout(2_000),
}).then(console.info)

fromDOMMutations(document.querySelector('#mutant')!, { childList: true })
  .pipeThrough(addedNodes())
  .pipeTo(write(console.info))

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
