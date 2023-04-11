import { staticImplements } from '@johngw/stream-common/Function'
import { TimelineParsable, TimelineItem } from './TimelineItem.js'

export const CloseTimeline = Symbol.for('@johngw/stream-test close timeline')
export type CloseTimeline = typeof CloseTimeline

@staticImplements<TimelineParsable<TimelineItemClose>>()
export class TimelineItemClose implements TimelineItem<CloseTimeline> {
  get(): CloseTimeline {
    return CloseTimeline
  }

  onReach() {
    //
  }

  onPass() {
    //
  }

  toTimeline() {
    return '|'
  }

  static parse(timelinePart: string) {
    return timelinePart === '|' ? new TimelineItemClose() : undefined
  }
}
