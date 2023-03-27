export function parseTimelineValue(value: string): unknown {
  value = value.trim()

  switch (true) {
    case /^\d+(\.\d+)?$/.test(value):
      return Number(value)

    case value === 'true':
      return true

    case value === 'false':
      return false

    case value === 'null':
      return null

    case value === 'E':
      return new TimelineError()

    case value === '|':
      return new CloseTimelineError()

    case value === 'X':
      return new TerminateTimelineError()

    case /^\{.*\}$/.test(value):
      return value
        .slice(1, -1)
        .split(/\s*,\s*/g)
        .reduce((acc, x) => {
          const [key, value] = x.split(/\s*:\s*/g)
          return { ...acc, [key.trim()]: parseTimelineValue(value) }
        }, {})

    case /^\[.*\]$/.test(value):
      return value.slice(1, -1).split(',').map(parseTimelineValue)

    default:
      return value
  }
}

export class TimelineError extends Error {}

export class CloseTimelineError extends TimelineError {}

export class TerminateTimelineError extends TimelineError {
  constructor() {
    super('The stream was expected to have closed by now')
  }
}
