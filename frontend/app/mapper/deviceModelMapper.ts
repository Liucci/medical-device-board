import {
         DeviceModelType,
         DeviceModelDBType,
         CreateDeviceModelFrontType,
         CreateDeviceModelBackType,
         UpdateDeviceModelFrontType,
         UpdateDeviceModelBackType,
         DeleteDeviceModelsFrontType,
         DeleteDeviceModelsBackType
       } from "../types/deviceModelTypes"

// DB → UI
export const normalizeDeviceModel = (
                                      d: DeviceModelDBType
                                    ): DeviceModelType => ({
                                                              id: d.id,
                                                              hospitalId: d.hospital_id,
                                                              deviceTypeId: d.device_type_id,
                                                              name: d.name,
                                                              displayRemainingCount: d.display_remaining_count,
                                                              remainingAlertCount: d.remaining_alert_count
                                                            })
// Create
export const toCreateDeviceModelRequest = (
                                             deviceModel: CreateDeviceModelFrontType
                                           ) :CreateDeviceModelBackType=> ({
                                                   device_type_id: deviceModel.deviceTypeId,
                                                   name: deviceModel.name,
                                                   display_remaining_count:deviceModel.displayRemainingCount,
                                                   remaining_alert_count: deviceModel.remainingAlertCount
                                                 })

// Update
export const toUpdateDeviceModelRequest = (
                                             deviceModel: UpdateDeviceModelFrontType
                                           ): UpdateDeviceModelBackType => ({
                                                                              id: deviceModel.id,
                                                                              name: deviceModel.name,
                                                                              display_remaining_count: deviceModel.displayRemainingCount,
                                                                              remaining_alert_count: deviceModel.remainingAlertCount
                                                                            })
// Delete
export const toDeleteDeviceModelsRequest = (
                                               deviceModels: DeleteDeviceModelsFrontType
                                             ) :DeleteDeviceModelsBackType=> ({
                                                     ids: deviceModels.ids
                                                   })