export type HistoryExportRow = {
  createdAt?: string | null
  deviceId: number
  deviceTypeName?: string | null
  deviceModelName?: string | null
  actionType: string
  maintenanceStartedAt?: string | null
  maintenanceFinishedAt?: string | null
  locationName?: string | null
  patientName?: string | null
  message?: string | null
}
export type ExportHistoriesRequest = {
  rows: HistoryExportRowDB[]
}

export type HistoryExportRowDB = {
  created_at: string | null
  device_id: number
  device_type_name: string | null
  device_model_name: string | null
  action_type: string
  maintenance_started_at: string | null
  maintenance_finished_at: string | null
  location_name: string | null
  patient_name: string | null
  message: string | null
}


