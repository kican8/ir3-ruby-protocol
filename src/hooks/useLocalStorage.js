import { useState, useEffect, useCallback } from 'react'

/**
 * React hook for persisting state in localStorage.
 * Reads the initial value from localStorage (falling back to initialValue),
 * and syncs every update back to localStorage.
 *
 * @param {string} key - localStorage key
 * @param {*} initialValue - Default value when nothing is stored
 * @returns {[*, Function]} [storedValue, setValue]
 */
export default function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item !== null ? JSON.parse(item) : initialValue
    } catch (error) {
      console.warn(`useLocalStorage: error reading key "${key}"`, error)
      return initialValue
    }
  })

  // Sync to localStorage whenever storedValue changes
  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue))
    } catch (error) {
      console.warn(`useLocalStorage: error writing key "${key}"`, error)
    }
  }, [key, storedValue])

  // Stable setter that also accepts updater functions
  const setValue = useCallback((value) => {
    setStoredValue((prev) => (typeof value === 'function' ? value(prev) : value))
  }, [])

  return [storedValue, setValue]
}
