import { timeout } from '@johngw/stream-common/Async'
import { staticImplements } from '@johngw/stream-common/Function'
import { TimelineItem, TimelineParsable } from './TimelineItem.js'

@staticImplements<TimelineParsable<TimelineItemDash>>()
export class TimelineItemDash extends TimelineItem<undefined> {
  get() {
    return undefined
  }

  override async onReach() {
    await super.onReach()
    return timeout(1)
  }

  static parse(timeline: string) {
    return timeline === '-' ? new TimelineItemDash(timeline) : undefined
  }
}
