import { staticImplements } from '@johngw/stream-common/Function'
import { TimelineItem, TimelineParsable } from './TimelineItem.js'

@staticImplements<TimelineParsable<TimelineItemNull>>()
export class TimelineItemNull implements TimelineItem<null> {
  get() {
    return null
  }

  toTimeline() {
    return 'N'
  }

  onReach() {
    //
  }

  onPass() {
    //
  }

  static parse(timelinePart: string) {
    return timelinePart === 'N' ? new TimelineItemNull() : undefined
  }
}
