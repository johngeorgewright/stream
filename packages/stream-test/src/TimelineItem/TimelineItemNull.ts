import { staticImplements } from '@johngw/stream-common/Function'
import { TimelineItem, TimelineParsable } from './TimelineItem.js'

/**
 * A timeline item, with the value of `null` that is generated
 * with the shorthand `N`.
 */
@staticImplements<TimelineParsable<TimelineItemNull>>()
export class TimelineItemNull extends TimelineItem<null> {
  constructor() {
    super('N')
  }

  get() {
    return null
  }

  static readonly #regex = this.createItemRegExp('N')

  static parse(timeline: string) {
    return this.#regex.test(timeline)
      ? ([timeline.slice(1), new TimelineItemNull()] as const)
      : undefined
  }
}
