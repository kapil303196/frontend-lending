const STORAGE_KEY_PREFIX = 'fund-direct-form'

export const useFormPersistence = (uniqueId: string) => {
  const storageKey = `${STORAGE_KEY_PREFIX}-${uniqueId}`
  
  const loadSavedData = () => {
    try {
      const saved = localStorage.getItem(storageKey)
      if (saved) {
        const data = JSON.parse(saved)
        const sevenDaysAgo = Date.now() - (7 * 24 * 60 * 60 * 1000)
        if (data.timestamp && data.timestamp > sevenDaysAgo) {
          return data
        }
      }
    } catch (error) {
      console.error('Error loading saved form data:', error)
    }
    return null
  }

  const saveData = (data: any) => {
    try {
      const dataToSave = {
        ...data,
        timestamp: Date.now()
      }
      localStorage.setItem(storageKey, JSON.stringify(dataToSave))
    } catch (error) {
      console.error('Error saving form data:', error)
    }
  }

  const clearSavedData = () => {
    try {
      localStorage.removeItem(storageKey)
    } catch (error) {
      console.error('Error clearing saved data:', error)
    }
  }

  return {
    loadSavedData,
    saveData,
    clearSavedData
  }
}

