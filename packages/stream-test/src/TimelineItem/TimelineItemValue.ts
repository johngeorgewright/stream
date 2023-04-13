import { TimelineItem } from './TimelineItem.js'
import { TimelineItemFactoryResult } from './TimelineItemFactory.js'

export type TimelineItemValue = TimelineItemFactoryResult extends TimelineItem<
  infer V
>
  ? V
  : never
