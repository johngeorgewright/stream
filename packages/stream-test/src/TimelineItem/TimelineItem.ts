import { timeout } from '@johngw/stream-common/Async'
import { StaticType } from '@johngw/stream-common/Function'

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
   */
  async onPass() {
    const length = this.#rawValue.length - 1
    for (let i = 0; i < length; i++) await timeout(1)
  }

  /**
   * Called when this item is reached in the timeline.
   */
  onReach(): void | Promise<void> {
    //
  }

  /**
   * The string representation of this item in a timeline.
   */
  toTimeline(): string {
    return this.rawValue
  }

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
