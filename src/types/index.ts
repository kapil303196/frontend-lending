export interface MCAData {
  success: boolean
  data: {
    _id: string
    phoneNumber: string
    numbertype: string
    networktype: string
    firstName: string
    lastName: string
    company: string
    email: string
    phone2?: string
    phone3?: string
    address?: string
    city?: string
    state?: string
    zip?: string
    taxId?: string
    birthDate?: string
    dateBusinessStarted?: string
    monthlyRevenue?: string
    uniqueId: string
    createdAt: string
    updatedAt: string
    isActive: boolean
    userResponses: any[]
    [key: string]: any
  }
}

export interface FormData {
  // Business Information
  legalBusinessName: string
  dba: string
  businessEmail: string
  ein: string
  businessStartDate: string
  streetAddress: string
  city: string
  state: string
  zipCode: string
  
  // Business Funding
  amountRequested: string
  monthlyRevenue: string
  hasExistingBalances: string
  existingLender?: string
  existingBalance?: string
  numberOfOwners: string
  
  // Primary Owner Information
  firstName: string
  lastName: string
  ownerEmail: string
  phone: string
  ssn: string
  ownershipPercent: string
  dateOfBirth: string
  ownerStreetAddress: string
  ownerCity: string
  ownerState: string
  ownerZip: string
  fundDirectSpecialist: string
  
  // Files
  bankStatements: File[]
  
  // Signature
  signature: string
  signatureDate: string
  
  // Metadata
  uniqueId: string
  ipAddress?: string
}

