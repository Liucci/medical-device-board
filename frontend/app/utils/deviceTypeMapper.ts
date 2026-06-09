import {
         DeviceTypeType,
         DeviceTypeDBType,
         CreateDeviceTypeType,
         UpdateDeviceTypeType,
         DeleteDeviceTypeType
       } from "../types/deviceTypeTypes"

// DB → UI
export const normalizeDeviceType = (
                                      d: DeviceTypeDBType
                                    ): DeviceTypeType => ({
                                                            id: d.id,
                                                            hospitalId: d.hospital_id,
                                                            name: d.name
                                                          })

// Create
export const toCreateDeviceTypeRequest = (
                                            deviceType: CreateDeviceTypeType
                                          ) => ({
                                                  name: deviceType.name
                                                })

// Update
export const toUpdateDeviceTypeRequest = (
                                            deviceType: UpdateDeviceTypeType
                                          ) => ({
                                                  id: deviceType.id,
                                                  name: deviceType.name
                                                })

// Delete
export const toDeleteDeviceTypeRequest = (
                                            deviceType: DeleteDeviceTypeType
                                          ) => ({
                                                  id: deviceType.id
                                                })