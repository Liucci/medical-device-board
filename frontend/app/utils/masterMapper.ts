import {
        DeviceTypeDB,
        DeviceType,
        DeviceModelDB,
        DeviceModel
        } from "../types/masterTypes"


// DB → UI
export const normalizeDeviceType = (
                                     d: DeviceTypeDB
                                     ): DeviceType => ({
  id: d.id,
  hospitalId: d.hospital_id,
  name: d.name
})


// UI → DB
export const toDBDeviceType = (
                                d: DeviceType
                                ) => ({
  hospital_id: d.hospitalId,
  name: d.name
})


// DB → UI
export const normalizeDeviceModel = (
                                      d: DeviceModelDB
                                      ): DeviceModel => ({
  id: d.id,
  hospitalId: d.hospital_id,
  deviceTypeId: d.device_type_id,
  name: d.name
})


// UI → DB
export const toDBDeviceModel = (
                                 d: DeviceModel
                                 ) => ({
  hospital_id: d.hospitalId,
  device_type_id: d.deviceTypeId,
  name: d.name
})