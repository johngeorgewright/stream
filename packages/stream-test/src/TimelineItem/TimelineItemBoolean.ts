import { staticImplements } from '@johngw/stream-common/Function'
import { TimelineParsable, TimelineItem } from './TimelineItem.js'

/**
 * Represents the shorthand for a boolean value, in a timeline.
 *
 * @remarks
 * Can either be `F` (false) or `T` (true).
 */
@staticImplements<TimelineParsable<TimelineItemBoolean>>()
export class TimelineItemBoolean extends TimelineItem<boolean> {
  #value: boolean

  constructor(rawValue: 'F' | 'T') {
    super(rawValue)
    this.#value = rawValue === 'T'
  }

  get() {
    return this.#value
  }

  static readonly #regexp = new RegExp(`^([FT])${this.regexEnding}`)

  static parse(timeline: string) {
    const result = this.#regexp.exec(timeline)
    return result
      ? ([
          timeline.slice(1),
          new TimelineItemBoolean(result[1] as 'F' | 'T'),
        ] as const)
      : undefined
  }
}
