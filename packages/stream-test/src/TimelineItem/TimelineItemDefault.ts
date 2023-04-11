import { timeout } from '@johngw/stream-common/Async'
import { staticImplements } from '@johngw/stream-common/Function'
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
export class TimelineItemDefault
  implements TimelineItem<TimelineItemDefaultValue>
{
  #timeline: string
  #value: TimelineItemDefaultValue

  constructor(timeline: string) {
    this.#timeline = timeline
    this.#value = yaml.load(timeline) as TimelineItemDefaultValue
  }

  get() {
    return this.#value
  }

  onReach() {
    //
  }

  async onPass() {
    for (let i = 0; i < this.#timeline.length; i++) await timeout(1)
  }

  toTimeline() {
    return this.#timeline
  }

  static parse(timeline: string) {
    return new TimelineItemDefault(timeline)
  }
}

// /**
//  * Values that can be added in a timeline.
//  *
//  * @group Utils
//  * @category Timeline
//  */
// type TimelineItemDefaultValue = ValueOrArrayOrObject<
//   | number
//   | boolean
//   | string
//   | null
// >

// type ValueOrArrayOrObject<T> =
//   | T
//   | ValueOrArrayOrObject<T>[]
//   | {
//       // eslint-disable-next-line @typescript-eslint/no-explicit-any
//       [key: keyof any]: ValueOrArrayOrObject<T>
//     }
