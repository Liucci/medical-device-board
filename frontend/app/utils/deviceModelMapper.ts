import {
         DeviceModelType,
         DeviceModelDBType,
         CreateDeviceModelType,
         UpdateDeviceModelType,
         DeleteDeviceModelsType
       } from "../types/deviceModelTypes"

// DB → UI
export const normalizeDeviceModel = (
                                      d: DeviceModelDBType
                                    ): DeviceModelType => ({
                                                              id: d.id,
                                                              hospitalId: d.hospital_id,
                                                              deviceTypeId: d.device_type_id,
                                                              name: d.name
                                                            })

// Create
export const toCreateDeviceModelRequest = (
                                             deviceModel: CreateDeviceModelType
                                           ) => ({
                                                   device_type_id: deviceModel.deviceTypeId,
                                                   name: deviceModel.name
                                                 })

// Update
export const toUpdateDeviceModelRequest = (
                                             deviceModel: UpdateDeviceModelType
                                           ) => ({
                                                   id: deviceModel.id,
                                                   name: deviceModel.name
                                                 })

// Delete
export const toDeleteDeviceModelsRequest = (
                                               deviceModels: DeleteDeviceModelsType
                                             ) => ({
                                                     ids: deviceModels.ids
                                                   })