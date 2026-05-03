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

type stockArea = {
  id: number
  name: string
}


export type Device = {
  id?: number
  type: DeviceType["typeID"] 
  model: DeviceModel["modelID"]
  assetType: typeof AssetTypes[number]
  status: DeviceStatus // "stock" または "room"
  stockAreaID?:number  // 在庫エリアの名前（在庫エリアに配置されている場合のみ）
  wardId?: number      // 配置されている場合のみ
  roomId?: number
  //roomName?: string  // 配置されている場合のみ
  row: number
  col: number
  x?: number // ドラッグ中の一時的なx座標
  y?: number // ドラッグ中の一時的なy座標
  managementNumber?: string
  serialNumber?: string
  note?: string
  rentalStartDate?: string
  rentalEndDate?: string
  isUnderMaintenance?: boolean
  maintenanceStartedAt?: string
  maintenanceFinishedAt?: string
}
export type DeviceDB = {
  id: number
  type: number
  model: number
  asset_type: string
  status: "stock" | "room"
  stock_area_id: number | null
  room_id: number | null
  management_number?: string | null
  serial_number?: string | null
  note?: string | null
  rental_start_date?: string | null
  rental_end_date?: string | null
  is_under_maintenance:boolean
  maintenance_started_at?:string | null
  maintenance_finished_at?:string | null
}