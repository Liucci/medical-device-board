// Frontend標準型
export type RoomInfectionType = {
                                  id: number
                                  hospitalId: string
                                  roomId: number
                                  infectionTypeId: number
                                }

// Backend Response型
export type RoomInfectionDBType = {
                                    id: number
                                    hospital_id: string
                                    room_id: number
                                    infection_type_id: number
                                  }

// Create専用
export type CreateRoomInfectionType = {
                                        roomId: number
                                        infectionTypeId: number
                                      }

// Delete専用
export type DeleteRoomInfectionsType = {
                                        ids: number[]
                                      }