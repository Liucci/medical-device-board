export type HistoryExportRow = {
  createdAt?: string | null
  deviceId: number
  deviceTypeName?: string | null
  deviceModelName?: string | null
  actionType: string
  maintenanceStartedAt?: string | null
  maintenanceFinishedAt?: string | null
  roomName?: string | null
  stockAreaName?: string | null
  patientName?: string | null
  message?: string | null
}


export type HistoryExportRowDB = {
  created_at: string | null
  device_id: number
  device_type_name: string | null
  device_model_name: string | null
  action_type: string
  maintenance_started_at: string | null
  maintenance_finished_at: string | null
  room_name?: string | null
  stock_area_name?: string | null

  patient_name: string | null
  message: string | null
}

export type ExportHistoriesRequest = {
  rows: HistoryExportRowDB[]
}




//deviceListのexport用

// deviceList export

export type DeviceListExportUIType = {
  status: string

  isUnderMaintenance: boolean
  standby: boolean

  wardName?: string | null
  roomName?: string | null
  stockAreaName?: string | null

  patientName?: string | null

  deviceTypeName?: string | null
  deviceModelName?: string | null

  managementNumber?: string | null
  serialNumber?: string | null
  note?: string | null

  maintenanceName?: string | null
  dueAt?: string | null
}

export type DeviceListExportDBType = {
  status: string

  is_under_maintenance: boolean
  standby: boolean

  ward_name: string | null
  room_name: string | null
  stock_area_name: string | null

  patient_name: string | null

  device_type_name: string | null
  device_model_name: string | null

  management_number: string | null
  serial_number: string | null
  note: string | null

  maintenance_name: string | null
  due_at: string | null
}

export type DeviceListExportTypeRequest = {
  rows: DeviceListExportDBType[]
}