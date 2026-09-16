import {
         RoomType,
         RoomDBType,
         CreateRoomType,
         UpdateRoomType,
         UpdateRoomPatientType,
         DeleteRoomsType,
         ClearRoomPatientType
       } from "../types/roomTypes"

// DB → UI
export const normalizeRoom = (
                                r: RoomDBType
                              ): RoomType => ({
                                                 id: r.id,
                                                 hospitalId: r.hospital_id,
                                                 wardId: r.ward_id,
                                                 name: r.name,
                                                 patientName: r.patient_name ?? ""
                                               })

// Create
export const toCreateRoomRequest = (
                                      room: CreateRoomType
                                    ) => ({
                                            ward_id: room.wardId,
                                            name: room.name
                                          })

// Update
export const toUpdateRoomRequest = (
                                      room: UpdateRoomType
                                    ) => ({
                                            id: room.id,
                                            name: room.name
                                          })

// Patient Update
export const toUpdateRoomPatientRequest = (
                                             room: UpdateRoomPatientType
                                           ) => ({
                                                   id: room.id,
                                                   patient_name: room.patientName
                                                 })
//患者名変更、患者名入力UI無し専用mapper
export const toClearRoomPatientRequest = (
                                            room: ClearRoomPatientType
                                          ) => ({
                                                  id: room.id
                                                })

// Delete
export const toDeleteRoomsRequest = (
                                       rooms: DeleteRoomsType
                                     ) => ({
                                             ids: rooms.ids
                                           })

