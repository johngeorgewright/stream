import { staticImplements } from '@johngw/stream-common/Function'
import { TimelineParsable, TimelineItem } from './TimelineItem.js'

/**
 *
 */
@staticImplements<TimelineParsable<TimelineItemError>>()
export class TimelineItemError extends TimelineItem<TimelineError> {
  #error: TimelineError

  constructor(message?: string) {
    super(message === undefined ? 'E' : `E(${message})`)
    this.#error = new TimelineError(message)
  }

  get() {
    return this.#error
  }

  static readonly #regexp = new RegExp(
    `^(E(?:\\(([^)]*)\\))?)${this.regexEnding}`
  )

  static parse(timeline: string) {
    const result = this.#regexp.exec(timeline)
    return result
      ? ([
          timeline.slice(result[1].length),
          new TimelineItemError(result[2]),
        ] as const)
      : undefined
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
