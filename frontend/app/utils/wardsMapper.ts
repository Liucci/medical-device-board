import {
         WardType,
         WardDBType,
         CreateWardType,
         UpdateWardType,
         DeleteWardsType,
         UpdateWardOrderType,
         UpdateWardOrdersType
       } from "../types/wardTypes"

// DB → UI
export const normalizeWard = (
                                w: WardDBType
                              ): WardType => ({
                                                 id: w.id,
                                                 hospitalId: w.hospital_id,
                                                 name: w.name,
                                                 displayOrder: w.display_order
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

//並び順編集用
export const toUpdateWardOrdersRequest = (
                                          wards: UpdateWardOrdersType
                                          ) => ({
                                                  wards: wards.wards.map((ward) => ({
                                                                                    id: ward.id,
                                                                                    display_order: ward.displayOrder,
                                                                                  })),
                                                })