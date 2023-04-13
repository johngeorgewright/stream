import { staticImplements } from '@johngw/stream-common/Function'
import { TimelineItem, TimelineParsable } from './TimelineItem.js'

@staticImplements<TimelineParsable<TimelineItemNull>>()
export class TimelineItemNull extends TimelineItem<null> {
  get() {
    return null
  }

  static parse(timeline: string) {
    return timeline === 'N' ? new TimelineItemNull(timeline) : undefined
  }
}
