import { staticImplements } from '@johngw/stream-common/Function'
import { TimelineParsable, TimelineItem } from './TimelineItem.js'

@staticImplements<TimelineParsable<TimelineItemBoolean>>()
export class TimelineItemBoolean extends TimelineItem<boolean> {
  #value: boolean

  constructor(rawValue: string) {
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
      ? ([timeline.slice(1), new TimelineItemBoolean(result[1])] as const)
      : undefined
  }
}
