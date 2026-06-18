import {
  HistoryExportRow,
  HistoryExportRowDB,
  ExportHistoriesRequest
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
  location_name: row.locationName ?? null,
  patient_name: row.patientName ?? null,
  message: row.message ?? null
})

// Request作成
export const toExportHistoriesRequest = (
  rows: HistoryExportRow[]
): ExportHistoriesRequest => ({
  rows: rows.map(toHistoryExportRowRequest)
})