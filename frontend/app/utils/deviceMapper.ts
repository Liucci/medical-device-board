import { DeviceDB,Device } from "../types/deviceTypes"
// DBのDeviceと、フロントエンドで扱うDeviceの相互変換関数
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
  rentalStartDate: d.rental_start_date ?? undefined,
  rentalEndDate: d.rental_end_date ?? undefined,
  isUnderMaintenance: d.is_under_maintenance ?? false,
  maintenanceStartedAt:d.maintenance_started_at ?? undefined,
  maintenanceFinishedAt:d.maintenance_finished_at ?? undefined,
  // UI専用
  row: 0,
  col: 0,
})
// フロントエンドのDeviceをDB用のDeviceDBに変換する関数
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
  rental_start_date: d.rentalStartDate ?? null,
  rental_end_date: d.rentalEndDate ?? null,
  is_under_maintenance:d.isUnderMaintenance ?? false,
  maintenance_started_at:d.maintenanceStartedAt ?? null,
  maintenance_finished_at:d.maintenanceFinishedAt ?? null,
})