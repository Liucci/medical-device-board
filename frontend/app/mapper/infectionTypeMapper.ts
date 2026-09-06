import {
         InfectionTypeType,
         InfectionTypeDBType,
         CreateInfectionTypeType,
         UpdateInfectionTypeType,
         DeleteInfectionTypesType
       } from "../types/infectionTypeTypes"

// DB → UI
export const normalizeInfectionType = (
                                         i: InfectionTypeDBType
                                       ): InfectionTypeType => ({
                                                                  id: i.id,
                                                                  hospitalId: i.hospital_id,
                                                                  name: i.name,
                                                                  color: i.color
                                                                })
//requestはUI→backへ送る操作
// Create
export const toCreateInfectionTypeRequest = (
                                               infectionType: CreateInfectionTypeType
                                             ) => ({
                                                     name: infectionType.name,
                                                     color: infectionType.color
                                                   })

// Update
export const toUpdateInfectionTypeRequest = (
                                               infectionType: UpdateInfectionTypeType
                                             ) => ({
                                                     id: infectionType.id,
                                                     name: infectionType.name,
                                                     color: infectionType.color
                                                   })

// Delete
export const toDeleteInfectionTypesRequest = (
                                                 roomInfections: DeleteInfectionTypesType
                                               ) => ({
                                                       ids: roomInfections.ids
                                                     })