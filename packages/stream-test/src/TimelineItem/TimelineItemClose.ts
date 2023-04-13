import { staticImplements } from '@johngw/stream-common/Function'
import { TimelineParsable, TimelineItem } from './TimelineItem.js'

/**
 * A symbol to represent closing a timeline.
 */
export const CloseTimeline = Symbol.for('@johngw/stream-test close timeline')

/**
 * @inheritDoc
 */
export type CloseTimeline = typeof CloseTimeline

/**
 * A timeline item that'll close the stream.
 *
 * @remarks
 * This expects the string representation `|`.
 */
@staticImplements<TimelineParsable<TimelineItemClose>>()
export class TimelineItemClose extends TimelineItem<CloseTimeline> {
  constructor() {
    super('|')
  }

  get(): CloseTimeline {
    return CloseTimeline
  }

  static readonly #regexp = new RegExp(`^\\|${this.regexEnding}`)

  static parse(timeline: string) {
    return this.#regexp.test(timeline)
      ? ([timeline.slice(1), new TimelineItemClose()] as const)
      : undefined
  }
}
