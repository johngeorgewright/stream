import { defer, timeout } from '@johngw/stream-common/Async'
import { staticImplements } from '@johngw/stream-common/Function'
import { TimelineItem, TimelineParsable } from './TimelineItem.js'

@staticImplements<TimelineParsable<TimelineItemTimer>>()
export class TimelineItemTimer implements TimelineItem<TimelineTimer> {
  #timer: TimelineTimer

  constructor(ms: number) {
    this.#timer = new TimelineTimer(ms)
  }

  onReach() {
    this.#timer.start()
  }

  async onPass() {
    const length = this.toTimeline().length
    for (let i = 0; i < length; i++) await timeout(1)
  }

  get() {
    return this.#timer
  }

  toTimeline(): string {
    return `T${this.#timer.ms}`
  }

  static readonly #regex = /^T(\d+)$/

  static parse(timeline: string) {
    const result = this.#regex.exec(timeline)
    return result ? new TimelineItemTimer(Number(result[1])) : undefined
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
