import { asyncIterableToArray, takeWhile } from '@johngw/stream-common/Iterable'
import { takeCharsWhile } from '@johngw/stream-common/String'
import {
  TimelineFactoryResult,
  timelineItemFactory,
} from './TimelineItem/TimelineItem.js'
import {
  TimelineItemClose,
  TimelineItemDash,
  TimelineItemNeverReach,
  TimelineItemTimer,
} from './index.js'

export class Timeline implements AsyncIterableIterator<TimelineFactoryResult> {
  readonly #unparsed: string
  readonly #parsed: TimelineFactoryResult[]
  #position = -1

  constructor(timeline: string) {
    this.#unparsed = timeline
    this.#parsed = this.#parse(timeline)
  }

  get position() {
    return this.#position
  }

  toString() {
    return this.#unparsed
  }

  async toTimeline() {
    return (await asyncIterableToArray(this))
      .map((x) => x.toTimeline())
      .join('')
  }

  hasMoreItems() {
    return (
      this.#position < this.#parsed.length - 1 &&
      !!this.#parsed
        .slice(this.#position + 1)
        .filter(
          (value) =>
            !(value instanceof TimelineItemDash) &&
            !(value instanceof TimelineItemClose) &&
            !(value instanceof TimelineItemNeverReach) &&
            !(value instanceof TimelineItemTimer && value.get().finished)
        ).length
    )
  }

  toJSON() {
    return this.#parsed
  }

  async next(): Promise<IteratorResult<TimelineFactoryResult, undefined>> {
    if (this.#position < this.#parsed.length - 1) {
      const previous = this.#parsed[this.position]
      if (previous) await previous.onPass()

      const value = this.#parsed[++this.#position]
      await value.onReach()

      return { done: false, value: value }
    }

    return { done: true, value: undefined }
  }

  startOver() {
    this.#position = 0
  }

  [Symbol.asyncIterator]() {
    return this
  }

  #parse(
    timeline: string,
    result: TimelineFactoryResult[] = []
  ): TimelineFactoryResult[] {
    timeline = timeline.trim()

    const dashes = [...takeWhile(timeline, (x) => x === '-')]
    result.push(...dashes.map(timelineItemFactory))

    timeline = timeline.slice(dashes.length)
    if (!timeline.length) return result

    const unparsed = takeCharsWhile(timeline, (x) => x !== '-')
    result.push(timelineItemFactory(unparsed))

    return this.#parse(timeline.slice(unparsed.length), result)
  }
}
