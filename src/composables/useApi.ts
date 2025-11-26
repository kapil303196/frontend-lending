import { config } from '../config'

export const useApi = () => {
  const baseUrl = config.apiBaseUrl

  const fetchMCAData = async (uniqueId: string) => {
    const response = await fetch(`${baseUrl}/api/mca/${uniqueId}?includeResponses=true`)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    return await response.json()
  }

  const uploadFiles = async (files: File[]) => {
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
  }

  const searchAddress = async (input: string) => {
    const response = await fetch(`${baseUrl}/api/address/search?input=${encodeURIComponent(input)}`)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    return await response.json()
  }

  const getAddressDetails = async (placeId: string) => {
    const response = await fetch(`${baseUrl}/api/address/details/${placeId}`)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    return await response.json()
  }

  const submitResponse = async (data: any) => {
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

