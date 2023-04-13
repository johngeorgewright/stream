import { defer } from '@johngw/stream-common/Async'
import { staticImplements } from '@johngw/stream-common/Function'
import { TimelineItem, TimelineParsable } from './TimelineItem.js'

@staticImplements<TimelineParsable<TimelineItemTimer>>()
export class TimelineItemTimer extends TimelineItem<TimelineTimer> {
  #timer: TimelineTimer

  constructor(rawValue: string, ms: number) {
    super(rawValue)
    this.#timer = new TimelineTimer(ms)
  }

  override onReach() {
    this.#timer.start()
    return super.onReach()
  }

  get() {
    return this.#timer
  }

  static readonly #regex = /^T(\d+)$/

  static parse(timeline: string) {
    const result = this.#regex.exec(timeline)
    return result
      ? new TimelineItemTimer(timeline, Number(result[1]))
      : undefined
  }
}

/**
 * Represents a timer in a timeline.
 *
 * @group Utils
 * @category Timeline
 */
export class TimelineTimer {
  #finished = false
  #start?: number
  #end?: number
  readonly #ms: number
  #promise?: Promise<void>

  constructor(ms: number) {
    this.#ms = ms
  }

  start() {
    this.#start = Date.now()
    this.#end = this.#start + this.#ms
    const { promise, resolve } = defer()
    this.#promise = promise
    setTimeout(() => {
      this.#finished = true
      resolve()
    }, this.#ms)
  }

  toJSON() {
    if (!this.#promise) throw this.#notStartedError()
    return {
      name: 'TimelineTimer',
      finished: this.#finished,
      ms: this.#ms,
      timeLeft: this.timeLeft,
    }
  }

  get timeLeft() {
    if (this.#end === undefined) throw this.#notStartedError()
    return this.#end - Date.now()
  }

  get finished() {
    return this.#finished
  }

  get promise() {
    if (!this.#promise) throw this.#notStartedError()
    return this.#promise
  }

  get ms() {
    return this.#ms
  }

  #notStartedError() {
    return new Error('Timer has not been started')
  }
}
