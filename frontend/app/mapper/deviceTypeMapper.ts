import {
         DeviceTypeType,
         DeviceTypeDBType,
         CreateDeviceTypeFrontType,
         CreateDeviceTypeBackType,
         UpdateDeviceTypeFrontType,
         UpdateDeviceTypeBackType,
         DeleteDeviceTypeFrontType,
         DeleteDeviceTypeBackType,
         UpdateDeviceTypeOrdersType
       } from "../types/deviceTypeTypes"

// DB → UI
export const normalizeDeviceType = (
                                      d: DeviceTypeDBType
                                    ): DeviceTypeType => ({
                                                            id: d.id,
                                                            hospitalId: d.hospital_id,
                                                            name: d.name,
                                                            iconColor: d.icon_color,
                                                            displayOrder: d.display_order
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


// 並び順編集用
export const toUpdateDeviceTypeOrdersRequest = (
              deviceTypes: UpdateDeviceTypeOrdersType
              ) => ({
                      device_types: deviceTypes.deviceTypes.map((deviceType) => ({
                        id: deviceType.id,
                        display_order: deviceType.displayOrder,
                        icon_color: deviceType.iconColor,
              })),
})