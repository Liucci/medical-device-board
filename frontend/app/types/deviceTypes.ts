type DeviceType = {
  typeID: number
  name: string
}

export const deviceTypes: DeviceType[] = [
  { typeID: 1, name: "人工呼吸器" },
  { typeID: 2, name: "血液浄化装置" },
  { typeID: 3, name: "補助循環装置" },
]

type DeviceModel= {
  modelID: number
  typeID: number   // 大項目への紐付け
  name: string
}

export const deviceModels: DeviceModel[] = [
  { modelID: 1, typeID: 1, name: "Servo-i" },
  { modelID: 2, typeID: 1, name: "PB840" },
  { modelID: 3, typeID: 1, name: "Hamilton C6" },
  { modelID: 4, typeID: 2, name: "ACH-Σ" },
  { modelID: 5, typeID: 2, name: "TR-55X" },
  { modelID: 6, typeID: 3, name: "IABP" },
  { modelID: 7, typeID: 3, name: "ECMO" },
]

export const AssetTypes = [
  "資産",
  "レンタル"
] as const;

export type DeviceStatus = "stock" | "room"

type stockArea = {
  id: number
  name: string
}

export const stockAreas: stockArea[] = [
  { id: 1, name: "CE室" },
  { id: 2, name: "倉庫A" },
  { id: 3, name: "倉庫B" },
  { id: 4, name: "倉庫C" },
  { id: 5, name: "倉庫D" },
  { id: 6, name: "倉庫E" },
]

export type Device = {
  id: number
  type: DeviceType["typeID"] 
  model: DeviceModel["modelID"]
  assetType: typeof AssetTypes[number]
  status: DeviceStatus // "stock" または "room"
  stockAreaID?:number  // 在庫エリアの名前（在庫エリアに配置されている場合のみ）
  wardId?: number      // 配置されている場合のみ
  roomNumber?: string  // 配置されている場合のみ
  patientName?: string // 配置されている場合のみ
  row: number
  col: number
}