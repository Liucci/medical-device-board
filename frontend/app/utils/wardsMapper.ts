import {
         WardType,
         WardDBType,
         CreateWardType,
         UpdateWardType,
         DeleteWardsType,
         UpdateWardOrderType,
         UpdateWardOrdersType,
         UpdateWardInfoType
       } from "../types/wardTypes"

// DB → UI
export const normalizeWard = (
                                w: WardDBType
                              ): WardType => ({
                                                 id: w.id,
                                                 hospitalId: w.hospital_id,
                                                 name: w.name,
                                                 displayOrder: w.display_order,
                                                 status: w.status,
                                                 note: w.note,
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
                                       ward: DeleteWardsType
                                     ) => ({
                                             id: ward.id
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

// Update WardInfo
export const toUpdateWardInfoRequest = (
                                          ward: UpdateWardInfoType
                                        ) => ({
                                                id: ward.id,
                                                status: ward.status,
                                                note: ward.note,
                                        })