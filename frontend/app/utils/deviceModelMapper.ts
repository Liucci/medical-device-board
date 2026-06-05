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


// UI → DB
export const toDBDeviceModel = (
                                 d: DeviceModel
                                 ) => ({
  hospital_id: d.hospitalId,
  device_type_id: d.deviceTypeId,
  name: d.name
})