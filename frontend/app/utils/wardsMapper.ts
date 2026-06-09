import {
         WardType,
         WardDBType,
         CreateWardType,
         UpdateWardType,
         DeleteWardsType
       } from "../types/wardTypes"

// DB → UI
export const normalizeWard = (
                                w: WardDBType
                              ): WardType => ({
                                                 id: w.id,
                                                 hospitalId: w.hospital_id,
                                                 name: w.name
                                               })

// Create
export const toCreateWardRequest = (
                                      ward: CreateWardType
                                    ) => ({
                                            name: ward.name
                                          })

// Update
export const toUpdateWardRequest = (
                                      ward: UpdateWardType
                                    ) => ({
                                            id: ward.id,
                                            name: ward.name
                                          })

// Delete
export const toDeleteWardsRequest = (
                                       wards: DeleteWardsType
                                     ) => ({
                                             ids: wards.ids
                                           })