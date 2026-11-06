import { useCallback, useState } from 'react'
import type { HistoryEntry } from '../types'
import { addHistoryEntry, clearHistory, loadHistory } from '../lib/storage'

export function useHistory() {
  const [entries, setEntries] = useState<HistoryEntry[]>(() => loadHistory())

  const add = useCallback((seed: number) => {
    setEntries((current) => addHistoryEntry(current, seed))
  }, [])

  const clear = useCallback(() => {
    clearHistory()
    setEntries([])
  }, [])

  return { entries, add, clear }
}
