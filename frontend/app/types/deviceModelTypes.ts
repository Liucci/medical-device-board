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
export type CreateDeviceModelFrontType = {
                                      deviceTypeId: number
                                      name: string
                                    }
export type CreateDeviceModelBackType = {
                                      device_type_id: number
                                      name: string
                                    }



// Update専用
export type UpdateDeviceModelFrontType = {
                                      id: number
                                      name: string
                                    }
export type UpdateDeviceModelBackType = {
                                      id: number
                                      name: string
                                    }

// Delete専用
export type DeleteDeviceModelsFrontType = {
                                       ids: number[]
                                     }

export type DeleteDeviceModelsBackType = {
                                       ids: number[]
                                     }