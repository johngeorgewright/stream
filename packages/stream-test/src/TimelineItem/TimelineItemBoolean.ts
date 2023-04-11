import { staticImplements } from '@johngw/stream-common/Function'
import { TimelineParsable, TimelineItem } from './TimelineItem.js'

@staticImplements<TimelineParsable<TimelineItemBoolean>>()
export class TimelineItemBoolean implements TimelineItem<boolean> {
  #value: boolean

  constructor(value: boolean) {
    this.#value = value
  }

  get() {
    return this.#value
  }

  onReach() {
    //
  }

  onPass() {
    //
  }

  toTimeline() {
    return this.#value ? 'T' : 'F'
  }

  static parse(timelinePart: string) {
    return timelinePart === 'T'
      ? new TimelineItemBoolean(true)
      : timelinePart === 'F'
      ? new TimelineItemBoolean(false)
      : undefined
  }
}
