import {
         DeviceTypeType,
         DeviceTypeDBType,
         CreateDeviceTypeFrontType,
         CreateDeviceTypeBackType,
         UpdateDeviceTypeFrontType,
         UpdateDeviceTypeBackType,
         DeleteDeviceTypeFrontType,
         DeleteDeviceTypeBackType
       } from "../types/deviceTypeTypes"

// DB → UI
export const normalizeDeviceType = (
                                      d: DeviceTypeDBType
                                    ): DeviceTypeType => ({
                                                            id: d.id,
                                                            hospitalId: d.hospital_id,
                                                            name: d.name,
                                                            iconColor: d.icon_color
                                                          })

// Create
export const toCreateDeviceTypeRequest = (
                                            deviceType: CreateDeviceTypeFrontType
                                          ):CreateDeviceTypeBackType => ({
                                                  name: deviceType.name,
                                                  icon_color: deviceType.iconColor
                                                })

// Update
export const toUpdateDeviceTypeRequest = (
                                            deviceType: UpdateDeviceTypeFrontType
                                          ) :UpdateDeviceTypeBackType=> ({
                                                  id: deviceType.id,
                                                  name: deviceType.name,
                                                  icon_color: deviceType.iconColor
                                                })

// Delete
export const toDeleteDeviceTypeRequest = (
                                            deviceType: DeleteDeviceTypeFrontType
                                          ) :DeleteDeviceTypeBackType=> ({
                                                  id: deviceType.id
                                                })