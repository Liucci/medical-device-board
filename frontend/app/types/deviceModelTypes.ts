// Frontend標準型
export type DeviceModelType = {
                                id: number
                                hospitalId: string
                                deviceTypeId: number
                                name: string
                                displayRemainingCount: boolean
                                remainingAlertCount: number
                              }

// Backend Response型
export type DeviceModelDBType = {
                                  id: number
                                  hospital_id: string
                                  device_type_id: number
                                  name: string
                                  display_remaining_count: boolean
                                  remaining_alert_count: number
                                }

// Create専用
export type CreateDeviceModelFrontType = {
                                            deviceTypeId: number
                                            name: string
                                            displayRemainingCount:boolean
                                            remainingAlertCount: number
                                          }

export type CreateDeviceModelBackType = {
                                           device_type_id: number
                                           name: string
                                           display_remaining_count: boolean
                                           remaining_alert_count: number
                                         }

// Update専用
export type UpdateDeviceModelFrontType = {
                                            id: number
                                            name: string
                                            displayRemainingCount: boolean
                                            remainingAlertCount: number
                                          }

export type UpdateDeviceModelBackType = {
                                           id: number
                                           name: string
                                           display_remaining_count: boolean
                                           remaining_alert_count: number
                                         }

// Delete専用
export type DeleteDeviceModelsFrontType = {
                                             ids: number[]
                                           }

export type DeleteDeviceModelsBackType = {
                                            ids: number[]
                                          }