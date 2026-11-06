import { useCallback, useState } from 'react'
import type { HistoryEntry, Idea } from '../types'
import { addHistoryEntry, clearHistory, loadHistory, updateHistoryEntry } from '../lib/storage'

export function useHistory() {
  const [entries, setEntries] = useState<HistoryEntry[]>(() => loadHistory())

  const add = useCallback((idea: Idea) => {
    setEntries((current) => addHistoryEntry(current, idea))
  }, [])

  const update = useCallback((idea: Idea) => {
    setEntries((current) => updateHistoryEntry(current, idea))
  }, [])

  const clear = useCallback(() => {
    clearHistory()
    setEntries([])
  }, [])

  return { entries, add, update, clear }
}
