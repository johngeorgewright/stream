import { TimelineItemBoolean } from './TimelineItemBoolean.js'
import { TimelineItemClose } from './TimelineItemClose.js'
import { TimelineItemError } from './TimelineItemError.js'
import { TimelineItemNeverReach } from './TimelineItemNeverReach.js'
import { TimelineItemNull } from './TimelineItemNull.js'
import { TimelineItemTimer } from './TimelineItemTimer.js'
import { TimelineItemDefault } from './TimelineItemDefault.js'
import { TimelineItemDash } from './TimelineItemDash.js'
import { TimelineItem, TimelineParsable } from './TimelineItem.js'

const Items = [
  TimelineItemDash,
  TimelineItemBoolean,
  TimelineItemClose,
  TimelineItemError,
  TimelineItemNeverReach,
  TimelineItemNull,
  TimelineItemTimer,
  TimelineItemDefault,
] satisfies TimelineParsable<TimelineItem<unknown>>[]

export type TimelineItemFactoryResult = typeof Items extends Array<infer T>
  ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
    T extends abstract new (...args: any) => any
    ? InstanceType<T>
    : never
  : never

export function timelineItemFactory(
  timeline: string
): TimelineItemFactoryResult {
  for (const Item of Items) {
    const item = Item.parse(timeline)
    if (item !== undefined) return item
  }
  return new TimelineItemDefault(timeline)
}
