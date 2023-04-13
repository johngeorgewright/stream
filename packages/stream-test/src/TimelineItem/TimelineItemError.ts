import { staticImplements } from '@johngw/stream-common/Function'
import { TimelineParsable, TimelineItem } from './TimelineItem.js'

@staticImplements<TimelineParsable<TimelineItemError>>()
export class TimelineItemError extends TimelineItem<TimelineError> {
  #error: TimelineError

  constructor(rawValue: string, message?: string) {
    super(rawValue)
    this.#error = new TimelineError(message)
  }

  get() {
    return this.#error
  }

  static readonly #regexp = /^E(?:\(([^)]*)\))?$/

  static parse(timeline: string) {
    const result = this.#regexp.exec(timeline)
    if (!result) return
    return new TimelineItemError(timeline, result[1])
  }
}

/**
 * Base TimelineError.
 *
 * @group Utils
 * @category Timeline
 */
export class TimelineError extends Error {
  constructor(message?: string) {
    super(message || 'Timeline Error')
  }
}
