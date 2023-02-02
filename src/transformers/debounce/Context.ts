/**
 * The DebounceContext is passed to each {@link DebounceBehavior:interface} stage.
 *
 * @group Transformers
 * @see {@link DebounceBehavior:interface}
 * @see {@link debounce:function}
 */
export type DebounceContext = Readonly<{
  queued: boolean
  ms: number
  timer?: NodeJS.Timer
}>
