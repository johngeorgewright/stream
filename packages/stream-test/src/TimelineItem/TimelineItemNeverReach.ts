import { staticImplements } from '@johngw/stream-common/Function'
import { TimelineItem, TimelineParsable } from './TimelineItem.js'

@staticImplements<TimelineParsable<TimelineItemNeverReach>>()
export class TimelineItemNeverReach
  implements TimelineItem<NeverReachTimelineError>
{
  #error: NeverReachTimelineError

  constructor() {
    this.#error = new NeverReachTimelineError()
  }

  get() {
    return this.#error
  }

  onReach() {
    //
  }

  onPass() {
    //
  }

  toTimeline(): string {
    return 'X'
  }

  static parse(timelinePart: string) {
    return timelinePart === 'X' ? new TimelineItemNeverReach() : undefined
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
