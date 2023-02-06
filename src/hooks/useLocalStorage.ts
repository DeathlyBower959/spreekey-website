import { useState, useEffect } from 'react'

function useLocalStorage<T>(
  key: string,
  defaultValue?: T
): [T, React.Dispatch<React.SetStateAction<T>>] {
  const prefixedKey = `spreekey-${key}`

  const [value, setValue] = useState<T>(() => {
    let currentValue

    try {
      currentValue = JSON.parse(
        localStorage.getItem(prefixedKey) || String(defaultValue)
      )
    } catch (error) {
      currentValue = defaultValue
    }

    return currentValue
  })

  useEffect(() => {
    localStorage.setItem(prefixedKey, JSON.stringify(value))
  }, [value, prefixedKey])

  return [value, setValue]
}

export default useLocalStorage
