"use client"

import { Device, deviceModels, deviceTypes } from "../types/deviceTypes"

// ストックにある機器を表示するコンポーネント
// ストックの機器は、ドラッグして病棟リストに配置できる
// ストックの機器は、右クリックで削除できる
type Props = {
  devices: Device[]
  startDrag: (e: React.MouseEvent, device: Device) => void
  deleteDevice: (id: number) => void
}

const colorMap: Record<string, string> = {
  人工呼吸器: "bg-blue-200",
  血液浄化装置: "bg-red-200",
  補助循環装置: "bg-green-200",
}

export default function Stock({ devices, startDrag, deleteDevice }: Props) {
  return (
    <div className="flex-1 p-4 relative">
      <div className="relative w-full h-full">
        {devices.map((d) => {
          const typeName = deviceTypes.find((t) => t.typeID === d.type)?.name || "不明"
          const modelName = deviceModels.find((m) => m.modelID === d.model)?.name || "不明"

          return (
            <div
              key={d.id}
              onMouseDown={(e) => startDrag(e, d)}
              onContextMenu={(e) => {
                e.preventDefault()
                // 機種名の型式を削除しますか？確認ダイアログを表示
                if (confirm(`${typeName} ${modelName} を削除しますか？`)) {
                  deleteDevice(d.id)
                }
              }}
              style={{ position: "absolute", top: d.y, left: d.x, cursor: "grab" }}
              className={`p-3 border rounded ${colorMap[typeName]}`}
            >
              {typeName}
              <br />
              {modelName}
            </div>
          )
        })}
      </div>
    </div>
  )
}