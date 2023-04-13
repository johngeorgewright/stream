import { staticImplements } from '@johngw/stream-common/Function'
import { takeCharsUntil } from '@johngw/stream-common/String'
import yaml from 'js-yaml'
import { TimelineItem, TimelineParsable } from './TimelineItem.js'

export type TimelineItemDefaultValue = ValueOrArrayOrObject<
  string | number | boolean | null
>

export type ValueOrArrayOrObject<T> =
  | T
  | ValueOrArrayOrObject<T>[]
  | {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      [key: keyof any]: ValueOrArrayOrObject<T>
    }

@staticImplements<TimelineParsable<TimelineItemDefault>>()
export class TimelineItemDefault extends TimelineItem<TimelineItemDefaultValue> {
  #value: TimelineItemDefaultValue

  constructor(timeline: string) {
    super(timeline)
    this.#value = yaml.load(timeline) as TimelineItemDefaultValue
  }

  get() {
    return this.#value
  }

  static parse(timeline: string) {
    const unparsed = takeCharsUntil(timeline, '-')
    return unparsed.length
      ? ([
          timeline.slice(unparsed.length),
          new TimelineItemDefault(unparsed),
        ] as const)
      : undefined
  }
}
