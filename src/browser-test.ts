import { debounce } from './debounce'
import { fromDOMEvent } from './fromDOMEvent'
import { map } from './map'
import { open } from './open'
import { tap } from './tap'
import { withCounter } from './withCounter'
import 'typed-query-selector'
import { filter } from './filter'

const element = document.querySelector('a#click-test')

if (!element) throw new Error('cannot find clicky thing')

const stream = fromDOMEvent(element, 'click')
  .pipeThrough(tap((event) => console.info(event)))
  .pipeThrough(debounce(1_000))
  .pipeThrough(filter((event) => !!event.target))
  .pipeThrough(map((event) => event.target))
  .pipeThrough(withCounter())
  .pipeThrough(tap((event) => console.info(event)))

open(stream).catch(console.error)
