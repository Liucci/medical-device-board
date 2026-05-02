import { createPortal } from "react-dom"
import { useState } from "react"
import { useEffect } from "react"
//import { wards, Room } from "../types/wards"

type Props = {
  isOpen: boolean
  onClose: () => void
  onSubmit: (roomId: number, patientName: string) => void
  wardId: number | null
  wards: any[]
  rooms: any[]
  pendingDevice: any
}

export default function RoomModal({
  isOpen,
  onClose,
  onSubmit,
  wardId,
  wards,
  rooms,
  pendingDevice
}: Props) {

  const [selectedRoomId, setSelectedRoomId] = useState<number | null>(null)
  const [patientName, setPatientName] = useState("")


  useEffect(() => {
    if (!isOpen) return
    // ===== 既存room =====
    if (pendingDevice?.roomId) {
      setSelectedRoomId(
        pendingDevice.roomId
      )
      const room = rooms.find(
        r => r.id === pendingDevice.roomId
      )
      setPatientName(
        room?.patientName ?? ""
      )
    }
    // ===== stock機器 =====
    else {
      setSelectedRoomId(null)
      setPatientName("")
    }
  }, [
    isOpen,
    pendingDevice,
    rooms
  ])
  
  //既存の病室の患者名を表示するためのuseEffect
  useEffect(() => {
    if (!selectedRoomId) return

    const selectedRoom = rooms.find(r => r.id === selectedRoomId)

    if (selectedRoom) {
      setPatientName(selectedRoom.patientName ?? "")
    }}, [selectedRoomId, rooms])


  if (!isOpen || wardId === null) return null


  const ward = wards.find(w => w.id === wardId)

  const filteredRooms = rooms
                        .filter(r => r.ward_id === wardId)
                        .sort((a, b) => a.name.localeCompare(b.name, "ja"))

  return createPortal(
    <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-8">
        <h2 className="text-2xl font-bold mb-6 text-center">機器登録</h2>

        {/* 病棟表示 */}
        <div className="mb-4">
          <div className="text-sm text-gray-500">病棟</div>
          <div className="font-bold text-lg">{ward?.name}</div>
        </div>

        {/* Room dropdown */}
        <div className="mb-4">
          <div className="text-sm text-gray-500">病室</div>
          <select
            className="border p-2 w-full"
            value={selectedRoomId ?? ""}
            onChange={(e) => setSelectedRoomId(Number(e.target.value))}
          >
            <option value="">選択してください</option>
            {filteredRooms.map(r => (
              <option key={r.id} value={r.id}>
                {r.name}
              </option>
            ))}
          </select>
        </div>

        {/* 患者名 */}
        <div className="mb-4">
          <div className="text-sm text-gray-500">患者名</div>
          <input
            type="text"
            value={patientName}
            onChange={(e) => setPatientName(e.target.value)}
            className="border p-2 w-full"
            placeholder="患者名を入力"
          />
        </div>

        {/* ボタン */}
        <div className="flex justify-end gap-2">
          <button onClick={onClose}>キャンセル</button>
          <button
            onClick={() => {
              if (!selectedRoomId) return
              onSubmit(selectedRoomId, patientName)
            }}
            className="bg-blue-500 text-white px-3 py-1 rounded"
          >
            決定
          </button>
        </div>
      </div>
    </div>,
    document.body
  )
}