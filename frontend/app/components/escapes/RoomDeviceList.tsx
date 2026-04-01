"use client"

import { Device, deviceModels, deviceTypes } from "../../types/deviceTypes"

type Props = {
  devices: Device[]
  startDrag: (e: React.MouseEvent, device: Device) => void
  deleteRoomDevice: (id: number) => void
}

export default function RoomDeviceList({
  devices,
  startDrag,
  deleteRoomDevice,
}: Props) {

  const deviceColorMap: Record<string, string> = {
  人工呼吸器: "bg-blue-200",
  血液浄化装置: "bg-red-200",
  補助循環装置: "bg-green-200"
  }
  if (devices.length === 0) return null

  //病室内の機器アイコンの数に応じて、病室コンテナの高さを調整する
  const rows = Math.ceil(devices.length / 2)
  const containerHeight = 60 + rows * 70
  
  return (
      <div
        className="relative w-full border rounded bg-gray-50 mt-2"
        style={{ height: containerHeight }}
      >

      {/* 病室情報 */}
      <div className="absolute top-1 left-2 text-xs font-bold">
        {devices[0].roomNumber}
      </div>

      <div className="absolute top-1 right-2 text-xs text-gray-500">
        {devices[0].patientName}
      </div>

      {devices.map((d) => {

        const type = deviceTypes.find((t) => t.typeID === d.type)
        const model = deviceModels.find((m) => m.modelID === d.model)
        const colorClass = deviceColorMap[type?.name ?? ""] ?? "bg-gray-200"
        return (
          
          <div
            key={d.id}

            onMouseDown={(e) => {
              e.stopPropagation()
              startDrag(e, d)
            }}

            onContextMenu={(e) => {
              e.preventDefault()
              if (confirm("この配置を削除しますか？")) {
                deleteRoomDevice(d.id)
              }
            }}

            style={{
              position: "absolute",
              left: d.x ?? 10,
              top: d.y ?? 30,   // ← 初期位置を下げた
              zIndex: 10            
            }}

            className={`
              w-24 h-16
              border
              rounded
              shadow
              ${colorClass}
              flex flex-col items-center justify-center
              text-xs
              cursor-move
              hover:z-50 active:z-50
            `}             
             >
            <div className="font-bold">{type?.name}</div>
            <div>{model?.name}</div>
          </div>
        )
      })}

    </div>
  )
}