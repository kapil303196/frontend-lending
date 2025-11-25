import { useRuntimeConfig } from 'nuxt/app'

export const useApi = () => {
  const config = useRuntimeConfig()
  const baseUrl = config.public.apiBaseUrl

  const fetchMCAData = async (uniqueId: string) => {
    try {
      const response = await fetch(`${baseUrl}/api/mca/${uniqueId}?includeResponses=true`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      return await response.json()
    } catch (error) {
      console.error('Error fetching MCA data:', error)
      throw error
    }
  }

  const uploadFiles = async (files: File[]) => {
    try {
      const formData = new FormData()
      files.forEach(file => {
        formData.append('bankStatements', file)
      })

      const response = await fetch(`${baseUrl}/api/upload/multiple`, {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      return await response.json()
    } catch (error) {
      console.error('Error uploading files:', error)
      throw error
    }
  }

  const searchAddress = async (input: string) => {
    try {
      const response = await fetch(`${baseUrl}/api/address/search?input=${encodeURIComponent(input)}`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      return await response.json()
    } catch (error) {
      console.error('Error searching address:', error)
      throw error
    }
  }

  const getAddressDetails = async (placeId: string) => {
    try {
      const response = await fetch(`${baseUrl}/api/address/details/${placeId}`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      return await response.json()
    } catch (error) {
      console.error('Error getting address details:', error)
      throw error
    }
  }

  const submitResponse = async (data: any) => {
    try {
      const response = await fetch(`${baseUrl}/api/responses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      return await response.json()
    } catch (error) {
      console.error('Error submitting response:', error)
      throw error
    }
  }

  return {
    baseUrl,
    fetchMCAData,
    uploadFiles,
    searchAddress,
    getAddressDetails,
    submitResponse
  }
}

