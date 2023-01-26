export interface Debouncer {
  call(): void
}

export function debouncer(delayMs: number, callback: () => any): Debouncer {
  let id: NodeJS.Timeout

  return { call }

  function call() {
    clearTimeout(id)
    id = setTimeout(callback, delayMs)
  }
}
