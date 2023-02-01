/**
 * @module debounce
 */

/**
 * The DebounceContext is passed to each DebounceBehavior stage.
 *
 * @group Debounce
 * @see [DebounceBehavior](./Behavior.ts)
 * @see [debounce](./index.ts)
 */
export type DebounceContext = Readonly<{
  queued: boolean
  ms: number
  timer?: NodeJS.Timer
}>
