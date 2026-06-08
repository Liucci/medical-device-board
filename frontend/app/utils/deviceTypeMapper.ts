import {
          DeviceType,
          DeviceTypeDB
       } from "../types/deviceTypeTypes"


// DB → UI
export const normalizeDeviceType = (
                                      d: DeviceTypeDB
                                    ): DeviceType => ({
                                                        id: d.id,
                                                        hospitalId: d.hospital_id,
                                                        name: d.name
                                                      })


// Create
export const toCreateDeviceTypeRequest = (
                                            name: string
                                          ) => ({
                                                  name
                                                })


// Update
export const toUpdateDeviceTypeRequest = (
                                            deviceTypeId: number,
                                            name: string
                                          ) => ({
                                                  id: deviceTypeId,
                                                  name
                                                })


// Delete
export const toDeleteDeviceTypeRequest = (
                                            deviceTypeId: number
                                          ) => ({
                                                  id: deviceTypeId
                                                })