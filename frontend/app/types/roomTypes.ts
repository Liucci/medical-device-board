// Frontend標準型
export type RoomType = {
                         id: number
                         hospitalId: string
                         wardId: number
                         name: string
                         patientName?: string
                       }

// Backend Response型
export type RoomDBType = {
                           id: number
                           hospital_id: string
                           ward_id: number
                           name: string
                           patient_name?: string
                         }

// Create専用
export type CreateRoomType = {
                               wardId: number
                               name: string
                             }

// Update専用
export type UpdateRoomType = {
                               id: number
                               name: string
                             }

// Patient更新専用
export type UpdateRoomPatientType = {
                                      id: number
                                      patientName: string
                                    }

// Delete専用
export type DeleteRoomsType = {
                                ids: number[]
                              }