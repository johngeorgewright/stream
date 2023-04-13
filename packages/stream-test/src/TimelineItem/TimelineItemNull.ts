import { staticImplements } from '@johngw/stream-common/Function'
import { TimelineItem, TimelineParsable } from './TimelineItem.js'

@staticImplements<TimelineParsable<TimelineItemNull>>()
export class TimelineItemNull extends TimelineItem<null> {
  constructor() {
    super('N')
  }

  get() {
    return null
  }

  static readonly #regex = new RegExp(`^N${this.regexEnding}`)

  static parse(timeline: string) {
    return this.#regex.test(timeline)
      ? ([timeline.slice(1), new TimelineItemNull()] as const)
      : undefined
  }
}
