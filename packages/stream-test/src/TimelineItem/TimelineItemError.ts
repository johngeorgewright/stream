import { timeout } from '@johngw/stream-common/Async'
import { staticImplements } from '@johngw/stream-common/Function'
import { TimelineParsable, TimelineItem } from './TimelineItem.js'

@staticImplements<TimelineParsable<TimelineItemError>>()
export class TimelineItemError implements TimelineItem<TimelineError> {
  #message?: string
  #error: TimelineError

  constructor(message?: string) {
    this.#message = message
    this.#error = new TimelineError(message)
  }

  get() {
    return this.#error
  }

  onReach() {
    //
  }

  async onPass() {
    const length = this.toTimeline().length
    for (let i = 0; i < length; i++) await timeout(1)
  }

  toTimeline() {
    return this.#message ? `E(${this.#message})` : 'E'
  }

  static readonly #regexp = /^E(?:\(([^)]*)\))?$/

  static parse(timelinePart: string) {
    const result = this.#regexp.exec(timelinePart)
    if (!result) return
    return new TimelineItemError(result[1])
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
