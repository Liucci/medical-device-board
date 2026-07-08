// Frontend標準型
export type HospitalType = {
  //frontはidはもっていない
  id?: string
  hospitalName: string
  createdAt: string
  isActive: boolean
  updatedAt?: string
  pricePlan?: string
  note?: string
  userCount?: number
  deviceCount?: number
}

// Backend Response型
export type HospitalDBType = {
  id: string
  hospital_name: string
  created_at: string
  is_active: boolean
  updated_at?: string
  price_plan?: string
  note?: string
  user_count?: number
  device_count?: number
}

// Create専用
export type CreateHospitalType = {
  hospitalName: string
  pricePlan: string
  note?: string
}

// Update専用
export type UpdateHospitalType = {
  id: string
  hospitalName: string
  pricePlan: string
  isActive: boolean
  note?: string
}

// Request型
export type AddHospitalRequest = {
  hospital_name: string
  price_plan: string
  note?: string | null
}

export type UpdateHospitalRequest = {
  hospital_id: string
  hospital_name: string
  price_plan: string
  is_active: boolean
  note?: string | null
}