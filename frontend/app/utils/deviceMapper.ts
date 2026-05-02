import { DeviceDB,Device } from "../types/deviceTypes"

export const normalizeDevice = (d: DeviceDB): Device => ({
  id: d.id,
  type: d.type,
  model: d.model,
  assetType: d.asset_type as Device["assetType"], // ←ここだけ改善余地
  status: d.status,
  stockAreaID: d.stock_area_id ?? undefined,
  roomId: d.room_id ?? undefined,
  managementNumber: d.management_number ?? undefined,
  serialNumber: d.serial_number ?? undefined,
  note: d.note ?? undefined,

  // UI専用
  row: 0,
  col: 0,
})

export const toDBDevice = (d: Device) => ({
  //id: d.id,
  type: d.type,
  model: d.model,
  asset_type: d.assetType,
  status: d.status,
  stock_area_id: d.stockAreaID ?? null,
  room_id: d.roomId ?? null,
  management_number: d.managementNumber ?? null,
  serial_number: d.serialNumber ?? null,
  note: d.note ?? null,
})