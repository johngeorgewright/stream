import { staticImplements } from '@johngw/stream-common/Function'
import { TimelineParsable, TimelineItem } from './TimelineItem.js'

@staticImplements<TimelineParsable<TimelineItemBoolean>>()
export class TimelineItemBoolean extends TimelineItem<boolean> {
  #value: boolean

  constructor(rawValue: string, value: boolean) {
    super(rawValue)
    this.#value = value
  }

  get() {
    return this.#value
  }

  static parse(timeline: string) {
    return timeline === 'T'
      ? new TimelineItemBoolean(timeline, true)
      : timeline === 'F'
      ? new TimelineItemBoolean(timeline, false)
      : undefined
  }
}
