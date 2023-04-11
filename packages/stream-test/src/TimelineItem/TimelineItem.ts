import { StaticType } from '@johngw/stream-common/Function'
import { TimelineItemBoolean } from './TimelineItemBoolean.js'
import { TimelineItemClose } from './TimelineItemClose.js'
import { TimelineItemError } from './TimelineItemError.js'
import { TimelineItemNeverReach } from './TimelineItemNeverReach.js'
import { TimelineItemNull } from './TimelineItemNull.js'
import { TimelineItemTimer } from './TimelineItemTimer.js'
import { TimelineItemDefault } from './TimelineItemDefault.js'
import { TimelineItemDash } from './TimelineItemDash.js'

export interface TimelineItem<T> {
  get(): T
  onReach(): void | Promise<void>
  onPass(): void | Promise<void>
  toTimeline(): string
}

export interface TimelineParsable<T extends TimelineItem<unknown>>
  extends StaticType<T> {
  parse(timelinePart: string): T | undefined
}

const Items = [
  TimelineItemDash,
  TimelineItemBoolean,
  TimelineItemClose,
  TimelineItemError,
  TimelineItemNeverReach,
  TimelineItemNull,
  TimelineItemTimer,
  TimelineItemDefault,
]

export type TimelineFactoryResult = typeof Items extends Array<infer T>
  ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
    T extends abstract new (...args: any) => any
    ? InstanceType<T>
    : never
  : never

export type TimelineItemValue = TimelineFactoryResult extends TimelineItem<
  infer V
>
  ? V
  : never

export function timelineItemFactory(timeline: string): TimelineFactoryResult {
  for (const Item of Items) {
    const item = Item.parse(timeline)
    if (item !== undefined) return item
  }
  return new TimelineItemDefault(timeline)
}
