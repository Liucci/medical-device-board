import {
  WardInfectionType,
  WardInfectionDBType,
  CreateWardInfectionType,
  DeleteWardInfectionsType,
  UpdateWardInfectionsType
} from "../types/wardInfectionTypes"

// DB → UI
export const normalizeWardInfection = (
  w: WardInfectionDBType
): WardInfectionType => ({
  id: w.id,
  hospitalId: w.hospital_id,
  wardId: w.ward_id,
  infectionTypeId: w.infection_type_id
})

// UI → Backend

// Create
export const toCreateWardInfectionRequest = (
  wardInfection: CreateWardInfectionType
) => ({
  ward_id: wardInfection.wardId,
  infection_type_id: wardInfection.infectionTypeId
})

// Delete
export const toDeleteWardInfectionsRequest = (
  wardInfection: DeleteWardInfectionsType
) => ({
  ids: wardInfection.ids
})

// Update
export const toUpdateWardInfectionsRequest = (
  wardInfection: UpdateWardInfectionsType
) => ({
  ward_id: wardInfection.wardId,
  infection_type_ids: wardInfection.infectionTypeIds
})