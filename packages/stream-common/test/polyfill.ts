if (!('timeout' in AbortSignal)) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ;(AbortSignal as any).timeout = (ms: number) => {
    const abortController = new AbortController()
    setTimeout(() => abortController.abort(), ms)
    return abortController.signal
  }
}
