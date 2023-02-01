export type DebounceContext = Readonly<{
  queued: boolean
  ms: number
  timer?: NodeJS.Timer
}>
