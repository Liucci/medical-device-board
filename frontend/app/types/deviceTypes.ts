type DeviceType = {
  typeID: number
  name: string
}

export const deviceTypes: DeviceType[] = [
  { typeID: 1, name: "人工呼吸器" },
  { typeID: 2, name: "血液浄化装置" },
  { typeID: 3, name: "補助循環装置" },
  { typeID: 4, name: "体外式PM" },
  { typeID: 5, name: "心拍出量計" },
  { typeID: 6, name: "体温管理装置" }
]

type DeviceModel= {
  modelID: number
  typeID: number   // 大項目への紐付け
  name: string
}

export const deviceModels: DeviceModel[] = [
  { modelID: 1, typeID: 1, name: "V500" },
  { modelID: 2, typeID: 1, name: "V300" },
  { modelID: 3, typeID: 1, name: "savina300" },
  { modelID: 4, typeID: 1, name: "HamiltonC5" },
  { modelID: 5, typeID: 1, name: "V60" },
  { modelID: 6, typeID: 1, name: "NKV" },

  { modelID: 5, typeID: 2, name: "TR2020" },
  { modelID: 6, typeID: 2, name: "TR55X" },
  { modelID: 7, typeID: 2, name: "ACH-Σ" },

  { modelID: 8, typeID: 3, name: "Cardio Save" },
  { modelID: 9, typeID: 3, name: "CS300" },
  { modelID: 10, typeID: 3, name: "SP200" },
  { modelID: 11, typeID: 3, name: "Cardio Help" },
  { modelID: 12, typeID: 3, name: "IMPELLA" },

  { modelID: 13, typeID: 4, name: "3077(SSI)" },
  { modelID: 14, typeID: 4, name: "3085(DDD)" },

  { modelID: 15, typeID: 5, name: "Hemosphere" },

  { modelID: 16, typeID: 6, name: "Branketrol3" },
  { modelID: 17, typeID: 6, name: "Thermogard HQ" },
  { modelID: 18, typeID: 6, name: "Arctic Sun 5000" },
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
  { id: 2, name: "ICU機材庫" },
  { id: 3, name: "CCU機材庫" },
  { id: 4, name: "アンギオ室" },
  { id: 5, name: "諸室" },
  { id: 6, name: "OPE室更衣室" },
  { id: 7, name: "4F倉庫" },
  { id: 8, name: "4F鍵付倉庫" },
  { id: 9, name: "7F倉庫" },
  { id: 10, name: "研修棟102" },
  { id: 11, name: "研修棟112" }
]

export type Device = {
  id: number
  type: DeviceType["typeID"] 
  model: DeviceModel["modelID"]
  assetType: typeof AssetTypes[number]
  status: DeviceStatus // "stock" または "room"
  stockAreaID?:number  // 在庫エリアの名前（在庫エリアに配置されている場合のみ）
  wardId?: number      // 配置されている場合のみ
   roomId?: number
  roomName?: string  // 配置されている場合のみ
  row: number
  col: number
  x?: number // ドラッグ中の一時的なx座標
  y?: number // ドラッグ中の一時的なy座標
}