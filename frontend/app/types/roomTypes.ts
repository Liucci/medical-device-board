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

// Create専用 wardID表示が正しい
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
                                    
//患者名変更用、ただし患者名入力UI無い場合専用
export type ClearRoomPatientType = {
                                     id: number
                                   }


// Delete専用
export type DeleteRoomsType = {
                                ids: number[]
                              }