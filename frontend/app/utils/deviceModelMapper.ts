import {
        DeviceModelDB,
        DeviceModel
       } from "../types/deviceModelTypes"


// DB → UI
export const normalizeDeviceModel = (
                                      d: DeviceModelDB
                                    ): DeviceModel => ({
                                                          id: d.id,
                                                          hospitalId: d.hospital_id,
                                                          deviceTypeId: d.device_type_id,
                                                          name: d.name
                                                        })


// Create
export const toCreateDeviceModelRequest = (
                                             deviceTypeId: number,
                                             name: string
                                           ) => ({
                                                   device_type_id: deviceTypeId,
                                                   name
                                                 })


// Update
export const toUpdateDeviceModelRequest = (
                                             deviceModelId: number,
                                             name: string
                                           ) => ({
                                                   id: deviceModelId,
                                                   name
                                                 })


// Delete
export const toDeleteDeviceModelsRequest = (
                                               ids: number[]
                                             ) => ({
                                                     ids
                                                   })