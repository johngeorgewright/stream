import { defer } from '@johngw/stream-common/Async'
import { staticImplements } from '@johngw/stream-common/Function'
import { TimelineItem, TimelineParsable } from './TimelineItem.js'

/**
 * A timeline item that represents a timer.
 *
 * @remarks
 * Timers are used in 2 ways. One for simply delaying the stream's
 * content and the other is to expect that a certain amount of time
 * has passed since the previous item.
 */
@staticImplements<TimelineParsable<TimelineItemTimer>>()
export class TimelineItemTimer extends TimelineItem<TimelineTimer> {
  #timer: TimelineTimer

  constructor(ms: number) {
    super(`T${ms}`)
    this.#timer = new TimelineTimer(ms)
  }

  override onReach() {
    this.#timer.start()
    return super.onReach()
  }

  get() {
    return this.#timer
  }

  static readonly #regex = new RegExp(`^(T(\\d+))${this.regexEnding}`)

  static parse(timeline: string) {
    const result = this.#regex.exec(timeline)
    return result
      ? ([
          timeline.slice(result[1].length),
          new TimelineItemTimer(Number(result[2])),
        ] as const)
      : undefined
  }
}

/**
 * Represents a timer in a timeline.
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
