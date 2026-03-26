"use client"

import { MutableRefObject } from "react"
import { Device } from "../types/deviceTypes"
import { wards } from "../types/wards"
import RoomDeviceList from "./RoomDeviceList"
// 病棟ごとの配置された機器を表示するコンポーネント
//病棟機器表示関数のRoomDeviceListコンポーネントを呼び出す
//ドロップ判定用のrefを病棟ごとに設定
type Props = {
  wardRefs: MutableRefObject<{ [key: number]: HTMLDivElement | null }>
  roomDevices: Device[]
  startRoomDrag: (e: React.MouseEvent, device: Device) => void
  deleteRoomDevice: (id: number) => void
}

export default function WardList({ wardRefs, roomDevices, startRoomDrag, deleteRoomDevice }: Props) {
  return (
    <div className="w-60 border-r h-screen p-4">
      <h2 className="font-bold mb-4">病棟一覧</h2>
      <ul className="space-y-4">
        {wards.map((ward) => {
          const devicesInWard = roomDevices.filter((d) => d.wardId === ward.wardID)
          return (
            <li key={ward.wardID}>
              <div
                ref={(el) => {
                  wardRefs.current[ward.wardID] = el
                }}
                className="p-2 bg-gray-100 rounded"
              >
                {ward.name}
              </div>

              <RoomDeviceList
                devices={devicesInWard}
                startRoomDrag={startRoomDrag}
                deleteRoomDevice={deleteRoomDevice}
              />
            </li>
          )
        })}
      </ul>
    </div>
  )
}