import { timeout } from '@johngw/stream-common/Async'
import { StaticType } from '@johngw/stream-common/Function'

/**
 * The base class of a timeline item.
 */
export abstract class TimelineItem<T> {
  #rawValue: string

  get rawValue() {
    return this.#rawValue
  }

  constructor(rawValue: string) {
    this.#rawValue = rawValue
  }

  /**
   * Returns the value the `TimelineItem` decorates.
   */
  abstract get(): T

  /**
   * Called after this item has been used and before the next
   * item is "reached".
   *
   * @remarks
   * To match other timelines, that may be a string of dashes,
   * consider all characters in the raw value to wait just like
   * that of a dash.
   */
  async onPass() {
    const length = this.#rawValue.length - 1
    for (let i = 0; i < length; i++) await timeout(1)
  }

  /**
   * Called when this item is reached in the timeline.
   */
  onReach(): Promise<void> {
    return Promise.resolve()
  }

  /**
   * The string representation of this item in a timeline.
   */
  toTimeline(): string {
    return this.rawValue
  }

  /**
   * A piece of regular expression that will match something
   * after a timeline item.
   *
   * @remarks
   * This is generally one of:
   * - a dash
   * - a close symbol
   * - the end of the timeline
   */
  static readonly regexEnding = '(?:-|\\||$)'
}

/**
 * The static methods of a class that denote how it is turned
 * in to a {@link TimelineItem}.
 */
export interface TimelineParsable<
  T extends TimelineItem<unknown> = TimelineItem<unknown>
> extends StaticType<T> {
  parse(
    timelinePart: string
  ): undefined | readonly [restOfTimeline: string, timelineItem: T]
}