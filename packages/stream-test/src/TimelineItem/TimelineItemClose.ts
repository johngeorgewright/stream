import { staticImplements } from '@johngw/stream-common/Function'
import { TimelineParsable, TimelineItem } from './TimelineItem.js'

export const CloseTimeline = Symbol.for('@johngw/stream-test close timeline')
export type CloseTimeline = typeof CloseTimeline

@staticImplements<TimelineParsable<TimelineItemClose>>()
export class TimelineItemClose extends TimelineItem<CloseTimeline> {
  get(): CloseTimeline {
    return CloseTimeline
  }

  static parse(timeline: string) {
    return timeline === '|' ? new TimelineItemClose(timeline) : undefined
  }
}
