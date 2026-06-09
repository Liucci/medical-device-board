// Frontend標準型
export type WardType = {
                         id: number
                         hospitalId: string
                         name: string
                       }

// Backend Response型
export type WardDBType = {
                           id: number
                           hospital_id: string
                           name: string
                         }

// Create専用
export type CreateWardType = {
                               name: string
                             }

// Update専用
export type UpdateWardType = {
                               id: number
                               name: string
                             }

// Delete専用
export type DeleteWardsType = {
                                ids: number[]
                              }