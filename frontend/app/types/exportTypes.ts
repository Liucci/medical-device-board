export type HistoryExportRow = {
  createdAt?: string | null
  deviceId: number
  deviceTypeName?: string | null
  deviceModelName?: string | null
  actionType: string
  actionByName?: string | null
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
  action_by_name: string | null
  maintenance_started_at: string | null
  maintenance_finished_at: string | null
  room_name?: string | null
  stock_area_name?: string | null

  patient_name: string | null
  message: string | null
}

export type ExportHistoriesRequest = {
  rows: HistoryExportRowDB[]
  show_patient_name: boolean
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
  show_patient_name: boolean

}

// inspection result export
//最上位を「1回の点検」ではなく、同じ管理番号＋同じ点検表にする
export type InspectionExportUIType = {
  managementNumber?: string | null
  serialNumber?: string | null
  deviceTypeName?: string | null
  deviceModelName?: string | null
  inspectionTypeName?: string | null
  checklistName?: string | null
  inspections: InspectionExportInspectionUIType[]
}

export type InspectionExportInspectionUIType = {
  createdAt: string
  performedByName?: string | null
  results: InspectionResultExportUIType[]
}

export type InspectionResultExportUIType = {
  itemName: string
  value?: string | null
}

//Backendへ送るDB型
export type InspectionExportDBType = {
  management_number: string | null
  serial_number: string | null
  device_type_name: string | null
  device_model_name: string | null
  inspection_type_name: string | null
  checklist_name: string | null
  inspections: InspectionExportInspectionDBType[]
}

export type InspectionExportInspectionDBType = {
  created_at: string
  performed_by_name: string | null
  results: InspectionResultExportDBType[]
}

export type InspectionResultExportDBType = {
  item_name: string
  value: string | null
}

export type ExportInspectionRequest = {
  rows: InspectionExportDBType[]
}