import { staticImplements } from '@johngw/stream-common/Function'
import { TimelineItem, TimelineParsable } from './TimelineItem.js'

@staticImplements<TimelineParsable<TimelineItemNeverReach>>()
export class TimelineItemNeverReach extends TimelineItem<NeverReachTimelineError> {
  #error: NeverReachTimelineError

  constructor(rawValue: string) {
    super(rawValue)
    this.#error = new NeverReachTimelineError()
  }

  get() {
    return this.#error
  }

  static parse(timeline: string) {
    return timeline === 'X' ? new TimelineItemNeverReach(timeline) : undefined
  }
}

/**
 * An error to represent that the stream requires terminating.
 *
 * @group Utils
 * @category Timeline
 */
export class NeverReachTimelineError extends Error {
  constructor() {
    super('The stream was expected to have closed by now')
  }
}
