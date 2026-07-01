type DeviceType = {
  typeID: number
  name: string
}


type DeviceModel= {
  modelID: number
  typeID: number   // 大項目への紐付け
  name: string
}

export const AssetTypes = [
  "資産",
  "レンタル",
  "代替機",
] as const;

export type DeviceStatus = "stock" | "room"


//front側の型情報
//front側にid,hospitalId情報は必須ではない
export type Device = {
  id?: number
  hospitalId?:string
  type: DeviceType["typeID"] 
  model: DeviceModel["modelID"]
  assetType: typeof AssetTypes[number]
  status?: DeviceStatus // "stock" または "room"
  quantity?: number
  stockAreaId?:number  // 在庫エリアの名前（在庫エリアに配置されている場合のみ）
  wardId?: number    // 配置されている場合のみ
  roomId?: number
  //roomName?: string  // 配置されている場合のみ
  row?: number
  col?: number
  x?: number // ドラッグ中の一時的なx座標
  y?: number // ドラッグ中の一時的なy座標
  managementNumber?: string
  serialNumber?: string
  note?: string
  createAt?: string
  updateAt?: string
  rentalStartDate?: string
  rentalEndDate?: string
  isUnderMaintenance?: boolean |false
  maintenanceStartedAt?: string
  maintenanceFinishedAt?: string
  standby?: boolean |false
  standbyStartedAt?: string
  standbyFinishedAt?: string
  createdBy?: string
  updatedBy?: string

}

//back側の型情報
export type DeviceDB = {
  id: number
  hospital_id: string
  type: number
  model: number
  asset_type: string
  status: "stock" | "room"
  stock_area_id: number | null
  room_id: number | null
  management_number?: string | null
  serial_number?: string | null
  note?: string | null
  created_at?: string | null
  updated_at?: string | null
  rental_start_date?: string | null
  rental_end_date?: string | null
  is_under_maintenance:boolean
  maintenance_started_at?:string | null
  maintenance_finished_at?:string | null
  standby: boolean
  standby_started_at?: string | null
  standby_finished_at?: string | null
  created_by?: string
  updated_by?: string

}
//front型定義
export type CreateDeviceType = {
  type: DeviceType["typeID"]
  model: DeviceModel["modelID"]
  assetType: typeof AssetTypes[number]
  stockAreaId: number
  quantity: number
  rentalStartDate?: string
  rentalEndDate?: string
}

//request系はbackの型定義
export type AddDeviceRequest = {
  type: number
  model: number
  asset_type: typeof AssetTypes[number]
  stock_area_id: number
  rental_start_date?: string
  rental_end_date?: string
  quantity: number
}

export type DeleteDeviceRequest = {
  id: number
}

export type UpdateManagementNumberRequest = {
  id: number
  management_number: string
}

export type UpdateSerialNumberRequest = {
  id: number
  serial_number: string
}

export type UpdateNoteRequest = {
  id: number
  note: string
}

export type UpdateDeviceRentalDatesRequest = {
  id: number
  rental_start_date?: string | null
  rental_end_date?: string | null
}

export type MoveDeviceRequest = {
  id: number
  stock_area_id?: number | null
  room_id?: number | null
}

export type StartMaintenanceRequest = {
  id: number
}

export type FinishMaintenanceRequest = {
  id: number
}

export type UpdateMaintenanceDatesRequest = {
  id: number
  maintenance_started_at: string | null
  //maintenance_finished_at: string | null
}


export type StartStandbyRequest = {
  id: number
}

export type FinishStandbyRequest = {
  id: number
}

export type StockLastUpdatedRequest = {
  updated_at: string | null
}
export type StockLastUpdatedResponse = {
  updatedAt: string | null
}


export type WardLastUpdatedRequest = {
  updated_at: string | null
}
export type WardLastUpdatedResponse = {
  updatedAt: string | null
}

