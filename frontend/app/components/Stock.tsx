"use client"

import { Device, deviceModels, deviceTypes } from "../types/deviceTypes"

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

  const ICON_W = 110
  const ICON_H = 80
  const GAP = 10
  const COL = 6

  return (
    <div className="flex-1 p-4 relative">
      <div className="relative w-full h-full">

        {devices.map((d, index) => {
          //IDから機種と型式の名前を取得
          const typeName =
            deviceTypes.find((t) => t.typeID === d.type)?.name || "不明"

          const modelName =
            deviceModels.find((m) => m.modelID === d.model)?.name || "不明"

          // ★座標決定
          const autoX = (index % COL) * (ICON_W + GAP)
          const autoY = Math.floor(index / COL) * (ICON_H + GAP)

          const x = d.x ?? autoX
          const y = d.y ?? autoY

          return (
            <div
              key={d.id}
              onMouseDown={(e) => startDrag(e, d)}
              onContextMenu={(e) => {
                e.preventDefault()
                if (confirm(`${typeName} ${modelName} を削除しますか？`)) {
                  deleteDevice(d.id)
                }
              }}
              style={{
                position: "absolute",
                left: x,
                top: y,
                cursor: "grab"
              }}
              className={`
                w-24 h-16
                border
                rounded
                shadow
                ${colorMap[typeName]}
                flex flex-col items-center justify-center
                text-xs
              `}
            >
              <div className="font-bold">{typeName}</div>
              <div>{modelName}</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}