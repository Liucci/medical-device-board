import {
  HistoryExportRow,
  HistoryExportRowDB,
  ExportHistoriesRequest,

  DeviceListExportUIType,
  DeviceListExportDBType,
  DeviceListExportTypeRequest
} from "../types/exportTypes"
// UI → DB
export const toHistoryExportRowRequest = (
  row: HistoryExportRow
): HistoryExportRowDB => ({
  created_at: row.createdAt ?? null,
  device_id: row.deviceId,
  device_type_name: row.deviceTypeName ?? null,
  device_model_name: row.deviceModelName ?? null,
  action_type: row.actionType,
  maintenance_started_at: row.maintenanceStartedAt ?? null,
  maintenance_finished_at: row.maintenanceFinishedAt ?? null,
  room_name: row.roomName ?? null,
  stock_area_name: row.stockAreaName ?? null,  patient_name: row.patientName ?? null,
  message: row.message ?? null
})

// Request作成
export const toExportHistoriesRequest = (
  rows: HistoryExportRow[]
): ExportHistoriesRequest => ({
  rows: rows.map(toHistoryExportRowRequest)
})


//UI⇒DB
export const DeviceListExportDBMapper = (
  row: DeviceListExportUIType
): DeviceListExportDBType => ({
  status: row.status,

  is_under_maintenance: row.isUnderMaintenance,
  standby: row.standby,

  ward_name: row.wardName ?? null,
  room_name: row.roomName ?? null,
  stock_area_name: row.stockAreaName ?? null,

  patient_name: row.patientName ?? null,

  device_type_name: row.deviceTypeName ?? null,
  device_model_name: row.deviceModelName ?? null,

  management_number: row.managementNumber ?? null,
  serial_number: row.serialNumber ?? null,
  note: row.note ?? null,

  maintenance_name: row.maintenanceName ?? null,
  due_at: row.dueAt ?? null
})




// DB → UI
export const normalizeDeviceListExportRow = (
  row: DeviceListExportDBType
): DeviceListExportUIType => ({
  status: row.status,
  isUnderMaintenance:row.is_under_maintenance,
  standby:row.standby,
  wardName:row.ward_name,
  roomName:row.room_name,
  stockAreaName:row.stock_area_name,
  patientName:row.patient_name,
  deviceTypeName:row.device_type_name,
  deviceModelName:row.device_model_name,
  managementNumber:row.management_number,
  serialNumber:row.serial_number,
  note:row.note,
  maintenanceName:row.maintenance_name,
  dueAt:row.due_at
})