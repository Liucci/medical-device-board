// Frontend標準型
export type DeviceTypeType = {
                               id: number
                               hospitalId: string
                               name: string
                               iconColor: string
                             }

// Backend Response型
export type DeviceTypeDBType = {
                                 id: number
                                 hospital_id: string
                                 name: string
                                 icon_color: string
                               }

// Create専用
export type CreateDeviceTypeType = {
                                     name: string
                                     icon_color: string
                                   }

// Update専用
export type UpdateDeviceTypeType = {
                                     id: number
                                     name: string
                                     icon_color: string
                                   }

// Delete専用
export type DeleteDeviceTypeType = {
                                     id: number
                                   }