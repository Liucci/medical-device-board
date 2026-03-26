"use client"

import { Device } from "../types/deviceTypes"

// 病室内の配置された機器を表示するコンポーネント
// 病室内の機器は、ドラッグして病棟リストに戻すことができる
// 病室内の機器は、右クリックで削除できる
type Props = {
  devices: Device[]
  startRoomDrag: (e: React.MouseEvent, device: Device) => void
  deleteRoomDevice: (id: number) => void
}

export default function RoomDeviceList({ devices, startRoomDrag, deleteRoomDevice }: Props) {
  return (
    <div className="ml-2 mt-2 flex flex-col gap-2">
      {devices.map((d) => (
        <div
          key={d.id}
          onContextMenu={(e) => {
            e.preventDefault()
            if (confirm("この配置を削除しますか？")) deleteRoomDevice(d.id)
          }}
          className="p-2 border rounded bg-white shadow-sm"
        >
          <div className="text-sm font-bold">{d.roomNumber}</div>
          <div className="text-xs text-gray-600">{d.patientName}</div>
          <div
            onMouseDown={(e) => startRoomDrag(e, d)}
            className="mt-1 text-xs border p-1 rounded bg-gray-50 cursor-grab"
          >
            //機器名称と型式を表示
            <br>{d.type} </br>
            <br>{d.model}</br>

          
          </div>
        </div>
      ))}
    </div>
  )
}