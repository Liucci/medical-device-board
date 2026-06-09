import {
         RoomType,
         RoomDBType,
         CreateRoomType,
         UpdateRoomType,
         UpdateRoomPatientType,
         DeleteRoomsType
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

// Delete
export const toDeleteRoomsRequest = (
                                       rooms: DeleteRoomsType
                                     ) => ({
                                             ids: rooms.ids
                                           })
