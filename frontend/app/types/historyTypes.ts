export type History = {
  id?: number

  deviceId: number

  userId?: string

  actionType: string

  status?: string | null

  roomId?: number | null

  stockAreaId?: number | null

  managementNumber?: string | null

  serialNumber?: string | null

  note?: string | null

  errorCode?: string | null

  errorLevel?: string | null

  errorDetail?: string | null

  message?: string | null

  createdAt?: string | null

  patientName?: string | null

  deviceTypeName?: string | null

  deviceModelName?: string | null

  roomName?: string | null

  stockAreaName?: string | null

  maintenanceStartedAt?: string | null

  maintenanceFinishedAt?: string | null

  standbyStartedAt?: string | null

  standbyFinishedAt?: string | null

  hospitalId: string

  actionBy?: string | null
}


export type HistoryDB = {
  id: number

  device_id: number

  user_id?: string | null

  action_type: string

  status?: string | null

  room_id?: number | null

  stock_area_id?: number | null

  management_number?: string | null

  serial_number?: string | null

  note?: string | null

  error_code?: string | null

  error_level?: string | null

  error_detail?: string | null

  message?: string | null

  created_at?: string | null

  patient_name?: string | null

  device_type_name?: string | null

  device_model_name?: string | null

  room_name?: string | null

  stock_area_name?: string | null

  maintenance_started_at?: string | null

  maintenance_finished_at?: string | null

  standby_started_at?: string | null

  standby_finished_at?: string | null

  hospital_id: string

  action_by?: string | null
}