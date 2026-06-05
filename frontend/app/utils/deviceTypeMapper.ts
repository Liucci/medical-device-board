import {
        DeviceTypeDB,
        DeviceType,
        } from "../types/deviceTypeTypes"


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


