import { debounce } from './debounce'
import { fromDOMEvent } from './fromDOMEvent'
import { map } from './map'
import { tap } from './tap'
import { withCounter } from './withCounter'
import 'typed-query-selector'
import { filter } from './filter'
import { write } from './write'

const element = document.querySelector('a#click-test')

if (!element) throw new Error('cannot find clicky thing')

fromDOMEvent(element, 'click')
  .pipeThrough(tap((event) => console.info(event)))
  .pipeThrough(debounce(1_000))
  .pipeThrough(filter((event) => !!event.target))
  .pipeThrough(map((event) => event.target))
  .pipeThrough(withCounter())
  .pipeThrough(tap((event) => console.info(event)))
  .pipeTo(write())
  .catch(console.error)
