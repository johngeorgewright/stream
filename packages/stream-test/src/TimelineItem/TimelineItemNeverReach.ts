import { staticImplements } from '@johngw/stream-common/Function'
import { TimelineItem, TimelineParsable } from './TimelineItem.js'

/**
 * A timeline item that should never be reached.
 *
 * @remarks
 * Represented by the `X` character.
 */
@staticImplements<TimelineParsable<TimelineItemNeverReach>>()
export class TimelineItemNeverReach extends TimelineItem<NeverReachTimelineError> {
  #error: NeverReachTimelineError

  constructor() {
    super('X')
    this.#error = new NeverReachTimelineError()
  }

  get() {
    return this.#error
  }

  static readonly #regexp = new RegExp(`^X${this.regexEnding}`)

  static parse(timeline: string) {
    return this.#regexp.test(timeline)
      ? ([timeline.slice(1), new TimelineItemNeverReach()] as const)
      : undefined
  }
}

/**
 * An error to represent that the stream requires terminating.
 */
export class NeverReachTimelineError extends Error {
  constructor() {
    super('The stream was expected to have closed by now')
  }
}
