import { timeout } from '@johngw/stream-common/Async'
import { staticImplements } from '@johngw/stream-common/Function'
import { TimelineItem, TimelineParsable } from './TimelineItem.js'

@staticImplements<TimelineParsable<TimelineItemDash>>()
export class TimelineItemDash implements TimelineItem<undefined> {
  get() {
    return undefined
  }

  onReach() {
    return timeout(1)
  }

  onPass() {
    //
  }

  toTimeline() {
    return '-'
  }

  static parse(timeline: string) {
    return timeline === '-' ? new TimelineItemDash() : undefined
  }
}
