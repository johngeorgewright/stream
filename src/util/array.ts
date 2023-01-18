export function without<T>(array: T[], item: T): T[] {
  const index = array.indexOf(item)
  return [...array.slice(0, index), ...array.slice(index + 1)]
}
