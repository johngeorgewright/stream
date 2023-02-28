import * as Array from './utils/Array'
import * as Function from './utils/Function'
import * as Object from './utils/Object'
import * as Stream from './utils/Stream'
import * as String from './utils/String'

export * from './sinks/Forkable'
export * from './sinks/ForkableRecallStream'
export * from './sinks/ForkableReplayStream'
export * from './sinks/ForkableStream'
export * from './sinks/toArray'
export * from './sinks/toIterable'
export * from './sinks/toIterator'
export * from './sinks/write'

export * from './sources/Controllable'
export * from './sources/ControllableStream'
export * from './sources/fromIterable'
export * from './sources/fromDOMEvent'
export * from './sources/fromDOMMutations'
export * from './sources/immediatelyClosingReadableStream'
export * from './sources/interval'
export * from './sources/merge'
export * from './sources/race'
export * from './sources/roundRobin'

export * from './subjects/BaseSubject'
export * from './subjects/Subject'
export * from './subjects/Subjectable'
export * from './subjects/StatefulSubject'

export * from './transformers/accumulate'
export * from './transformers/addedNodes'
export * from './transformers/after'
export * from './transformers/buffer'
export * from './transformers/bufferCount'
export * from './transformers/debounce'
export * from './transformers/every'
export * from './transformers/flat'
export * from './transformers/filter'
export * from './transformers/find'
export * from './transformers/first'
export * from './transformers/groupBy'
export * from './transformers/identity'
export * from './transformers/interpose'
export * from './transformers/label'
export * from './transformers/map'
export * from './transformers/pairwise'
export * from './transformers/reduce'
export * from './transformers/removedNodes'
export * from './transformers/some'
export * from './transformers/stateReducer'
export * from './transformers/tap'
export * from './transformers/timeout'
export * from './transformers/withCounter'
export * from './transformers/withLatestFrom'

export const utils = {
  ...Array,
  ...Function,
  ...Object,
  ...Stream,
  ...String,
}
