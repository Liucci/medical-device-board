// Frontend標準型
export type DeviceModelType = {
                                id: number
                                hospitalId: string
                                deviceTypeId: number
                                name: string
                              }

// Backend Response型
export type DeviceModelDBType = {
                                  id: number
                                  hospital_id: string
                                  device_type_id: number
                                  name: string
                                }

// Create専用
export type CreateDeviceModelType = {
                                      deviceTypeId: number
                                      name: string
                                    }

// Update専用
export type UpdateDeviceModelType = {
                                      id: number
                                      name: string
                                    }

// Delete専用
export type DeleteDeviceModelsType = {
                                       ids: number[]
                                     }