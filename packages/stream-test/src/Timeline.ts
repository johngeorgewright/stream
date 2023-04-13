import { asyncIterableToArray, takeWhile } from '@johngw/stream-common/Iterable'
import { takeCharsWhile } from '@johngw/stream-common/String'
import {
  TimelineItemFactoryResult,
  timelineItemFactory,
} from './TimelineItem/TimelineItemFactory.js'
import {
  TimelineItemClose,
  TimelineItemDash,
  TimelineItemNeverReach,
  TimelineItemTimer,
} from './index.js'

export class Timeline
  implements AsyncIterableIterator<TimelineItemFactoryResult>
{
  readonly #unparsed: string
  readonly #parsed: TimelineItemFactoryResult[]
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

  async next(): Promise<IteratorResult<TimelineItemFactoryResult, undefined>> {
    if (this.#position >= this.#parsed.length - 1)
      return { done: true, value: undefined }

    const previous = this.#parsed[this.position]
    if (previous) await previous.onPass()

    const value = this.#parsed[++this.#position]
    await value.onReach()

    return { done: false, value }
  }

  startOver() {
    this.#position = -1
  }

  [Symbol.asyncIterator]() {
    return this
  }

  #parse(
    timeline: string,
    result: TimelineItemFactoryResult[] = []
  ): TimelineItemFactoryResult[] {
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
