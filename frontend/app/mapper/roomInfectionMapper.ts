import {
         RoomInfectionType,
         RoomInfectionDBType,
         CreateRoomInfectionType,
         DeleteRoomInfectionsType,
         UpdateRoomInfectionsType
       } from "../types/roomInfectionTypes"

// DB → UI
export const normalizeRoomInfection = (
                                         r: RoomInfectionDBType
                                       ): RoomInfectionType => ({
                                                                  id: r.id,
                                                                  hospitalId: r.hospital_id,
                                                                  roomId: r.room_id,
                                                                  infectionTypeId: r.infection_type_id
                                                                })
//UI→back
// Create
export const toCreateRoomInfectionRequest = (
                                               roomInfection: CreateRoomInfectionType
                                             ) => ({
                                                     room_id: roomInfection.roomId,
                                                     infection_type_id: roomInfection.infectionTypeId
                                                   })

// Delete
export const toDeleteRoomInfectionsRequest = (
                                               roomInfection: DeleteRoomInfectionsType
                                             ) => ({
                                                     ids: roomInfection.ids
                                                   })

// Update
export const toUpdateRoomInfectionsRequest = (
                                                roomInfection: UpdateRoomInfectionsType
                                              ) => ({
                                                      room_id: roomInfection.roomId,
                                                      infection_type_ids: roomInfection.infectionTypeIds
                                                    })