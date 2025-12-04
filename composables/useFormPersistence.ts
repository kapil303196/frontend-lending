import { ref, watch } from 'vue'

const STORAGE_KEY_PREFIX = 'fund-direct-form'

export const useFormPersistence = (uniqueId: string) => {
  const storageKey = `${STORAGE_KEY_PREFIX}-${uniqueId}`
  
  // Load saved data from localStorage
  const loadSavedData = () => {
    if (typeof window === 'undefined') return null
    
    try {
      const saved = localStorage.getItem(storageKey)
      if (saved) {
        const data = JSON.parse(saved)
        // Check if data is not too old (e.g., 7 days)
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

  // Save data to localStorage
  const saveData = (data: any) => {
    if (typeof window === 'undefined') return
    
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

  // Clear saved data
  const clearSavedData = () => {
    if (typeof window === 'undefined') return
    
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






