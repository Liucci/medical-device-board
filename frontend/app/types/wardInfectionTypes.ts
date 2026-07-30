// Frontend標準型
export type WardInfectionType = {
  id: number
  hospitalId: string
  wardId: number
  infectionTypeId: number
}

// Backend Response型
export type WardInfectionDBType = {
  id: number
  hospital_id: string
  ward_id: number
  infection_type_id: number
}

// Create専用
export type CreateWardInfectionType = {
  wardId: number
  infectionTypeId: number
}

// Delete専用
export type DeleteWardInfectionsType = {
  ids: number[]
}

// Update専用
export type UpdateWardInfectionsType = {
  wardId: number
  infectionTypeIds: number[]
}