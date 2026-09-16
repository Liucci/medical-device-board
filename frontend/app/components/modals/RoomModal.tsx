import { useState } from "react"
import { useEffect } from "react"
import { Device } from "../../types/deviceTypes"
import { WardType } from "../../types/wardTypes"
import { RoomType } from "../../types/roomTypes"
import CommonModal from "../common/CommonModal"

type Props = {
  isOpen: boolean
  onClose: () => void
  onSubmit: (roomId: number, patientName: string) => void
  wardId: number | null
  wards: WardType[]
  rooms: RoomType[]
  pendingDevice: Device | null
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
    if (pendingDevice?.roomId) {
      setSelectedRoomId(pendingDevice.roomId)
      const room = rooms.find(r => r.id === pendingDevice.roomId)
      setPatientName(room?.patientName ?? "")
    } else {
      setSelectedRoomId(null)
      setPatientName("")
    }
  }, [isOpen, pendingDevice, rooms])
  useEffect(() => {
    if (!selectedRoomId) return
    const selectedRoom = rooms.find(r => r.id === selectedRoomId)
    if (selectedRoom) {
      setPatientName(selectedRoom.patientName ?? "")
    }
  }, [selectedRoomId, rooms])
  if (!isOpen || wardId === null) return null
  const ward = wards.find(w => w.id === wardId)
  const filteredRooms = rooms.filter(r => r.wardId === wardId).sort((a, b) => a.name.localeCompare(b.name, "ja"))
  return (
    <CommonModal
      open={true}
      onClose={onClose}
      title="病室登録"
      maxWidth="max-w-[600px]"
    >
      <div className="w-full rounded-xl bg-gray-200 p-5">
        <div className="rounded-xl bg-white p-6 shadow-sm">
          <div className="space-y-5">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">
                病室情報
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                機器を配置する病室と患者名を入力してください。
              </p>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600">
                病棟
              </label>
              <div className="mt-1 rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm font-medium text-gray-700">
                {ward?.name ?? ""}
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600">
                病室
              </label>
              <select
                className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                value={selectedRoomId ?? ""}
                onChange={(e) => setSelectedRoomId(Number(e.target.value))}
              >
                <option value="">
                  病室を選択
                </option>
                {filteredRooms.map(r => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600">
                患者名
              </label>
              <input
                type="text"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                placeholder="患者名を入力"
              />
            </div>
            <div className="flex justify-end gap-3 border-t border-gray-200 pt-5">
              <button
                onClick={onClose}
                className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-200"
              >
                キャンセル
              </button>
              <button
                onClick={() => {
                  if (!selectedRoomId) return
                  onSubmit(selectedRoomId, patientName)
                }}
                disabled={!selectedRoomId}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300"
              >
                決定
              </button>
            </div>
          </div>
        </div>
      </div>
    </CommonModal>
  )
}